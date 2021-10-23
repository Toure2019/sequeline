/* eslint-disable @typescript-eslint/camelcase */
import {
  getDurationSecondFromTime,
  get422Error,
  getDatesWeek
} from '../../util/util'
import moment from 'moment'
import Repository from './repository'
import userService from './../user/service/user'
import userChantierRepository from './../chantier/repository/UserChantier'
import mainOeuvreRepository from './../mainOeuvreCedee/repository'
import planningSchema from './schema/planningSchema'
import absenceUserChantierSchema from './schema/absenceUserChantierSchema'
import DB from '../../database/connection'
import _ from 'lodash'

class Service {
  private static readonly DEFAULT_SECOND_WORK = 27900 // 7h45

  static async getDisponibiliteCalc(equipeId: any, date: string, userId: number, usersExtId? : number[]): Promise<any> {

    const users = await userService.findAllbyEquipe(
      null,
      null,
      'id',
      'asc',
      equipeId
    )
    
    let userIds = users.rows.map(o => o.id)
    if (userId) {
      userIds = userIds.filter(item => item == userId)
    }

    let extUserdata = []
    if (usersExtId && usersExtId.length) {
      extUserdata = await userService.findAllUsersById(usersExtId)
      userIds = userIds.concat(usersExtId)
    }
    let result = await Repository.getDataWeek(userIds, date)

    const allExistIdUserInCalc = result.map(item => item.t_user_id)
    const counts = {}
    for (const existId of allExistIdUserInCalc) {
      counts[existId] = counts[existId] ? counts[existId] + 1 : 1
    }
    const userIdListToComplete = userIds.filter(
      item => !counts[item] || counts[item] < 7
    )

    // truc infame issue de l'ancienne app
    if (userIdListToComplete && userIdListToComplete.length) {
      await this.createDataWeek(userIdListToComplete, date)
      result = result.concat(
        await Repository.getDataWeek(userIdListToComplete, date)
      )
    }

    const adapted = _.chain(result)
      .groupBy('t_user_id')
      .map(function(v: any, i) {
        let user = users.rows.find(element => {
          return element.id == i
        })
        if (!user) {
          user = extUserdata.find(el => { return el.id == i})
        }
        const equipeId = v[0].t_equipe_id
        const numEquipe = v[0].num_equipe
        const utilisateurId = v[0].t_user_id
        v.forEach(element => {
          delete element.t_equipe_id
          delete element.num_equipe
          delete element.t_user_id
        })
        return {
          t_user_id: utilisateurId,
          equipe_id: equipeId,
          num_equipe: numEquipe,
          nom: user.nom,
          prenom: user.prenom,
          nom_complet: user.nom_complet,
          mail: user.mail,

          data: _.orderBy(v, ['date'], ['asc'])
        }
      })
      .value()
    return adapted
  }

  static async updatePlanning(data: any, transaction = null) {
    const toCommit = false
    data.planningDuration = this.getPlanningDuration(data.hours)
    data.planningDurationReel =
      !data.hours || data.hours.length === 0 ? 0 : data.planningDuration
    if (!transaction) {
      transaction = await DB.transaction()
    }
    try {
      const result = await Repository.updatePlanningDay(data, transaction)
      await this.updateDispoDuration(data.date, data.userId, transaction)
      if (toCommit) {
        transaction.commit()
      }
      return result
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static getCodeJsByCode(code: string, codeEtablissement: string) {
    return Repository.getCodeJsByCode(code, codeEtablissement)
  }

  static async saveCodeJsUserChantier(data: any, transaction = null) {
    let toCommit = false
    if (!transaction) {
      transaction = await DB.transaction()
      toCommit = true
    }
    try {
      const result = await Repository.saveCodeJsUserChantier(
        data,
        transaction
      )
      if (toCommit) {
        transaction.commit()
      }
      return result
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }


  static async saveCodeAbsenceUserChantier(data: any, transaction = null) {
    let toCommit = false
    if (!transaction) {
      transaction = await DB.transaction()
      toCommit = true
    }
    try {
      const result = await Repository.saveCodeAbsenceUserChantier(
        data,
        transaction
      )
      await this.updateDispoDuration(data.date, data.t_user_id, transaction)
      if (toCommit) {
        transaction.commit()
      }
      return result
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static async deleteCodeAbsenceUserChantier(
    date: any,
    userId: number,
    absenceId: number
  ) {
    const transaction = await DB.transaction()
    try {
      const result = await Repository.deleteCodeAbsenceUserChantier(
        date,
        userId,
        absenceId,
        transaction
      )
      await this.updateDispoDuration(date, userId, transaction)
      transaction.commit()
      return result
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static async updateDispoDuration(
    date: string,
    userId: number,
    transaction = null
  ) {
    const dispoDuration: number = await this.getDispoDuration(
      date,
      userId,
      transaction
    )
    await Repository.updateDispoDuration(
      dispoDuration,
      date,
      userId,
      transaction
    )
  }

  static async validateRequest(data: any) {
    const response = planningSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async validateAbsenceUser(data: any) {
    const response = absenceUserChantierSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async getAllAbsenceUser(date: any, userId: number, transaction?) {
    return Repository.getAllAbsenceUser(date, userId, transaction)
  }

  static async getAllCodeJsUser(date: any, userId: number, transaction?) {
    return Repository.getAllCodeJsUser(date, userId, transaction)
  }

  // Créé ou rafraichis une entrée dans t_user_planning_data_calc pour chaque utilisateur de la liste sur la semaine du jour indiqué (= ancien processWeek)
  private static async createDataWeek(
    userIdListToCreate: number[],
    dateInWeek: string
  ) {
    const listToAdd: any[] = []
    const weekDates = getDatesWeek(dateInWeek)
    const momentDate = moment(dateInWeek)
    const data: any[] = await Repository.getUserDataValue(
      weekDates,
      momentDate.week(),
      momentDate.year(),
      userIdListToCreate
    )
    for (const idToComplet of userIdListToCreate) {
      for (const day of weekDates) {
        const dataUser: any = data.find(
          item => item.date === day && item.t_user_id === idToComplet
        )
        const dispoDuration = await this.substractDuration(
          dataUser?.planning_duration_reel || 0,
          day,
          idToComplet
        )
        const isEcartAlert = await this.isEcartAlert(
          dataUser?.ecart_end,
          dataUser?.ecart_start,
          dispoDuration
        )
        //TODO faire EVS state
        listToAdd.push({
          date: day,
          t_user_id: idToComplet,
          planning_code_hour: dataUser?.code_hour || '?',
          planning_duration: dataUser?.planning_duration_reel
            ? dataUser.planning_duration_reel
            : this.DEFAULT_SECOND_WORK,
          planning_duration_reel: dataUser?.planning_duration_reel || 0,
          dispo_duration: dispoDuration,
          is_detach: dataUser?.detach,
          code_recup: 0, //dataUser?.code_hour_recup, changer le type en base c'est pas un smallint bordel
          is_special_night: dataUser?.special_nuit,
          need_help_take_repos: dataUser?.need_help_take_repos,
          need_entretien: dataUser?.need_entretien,
          ecart_alert: isEcartAlert
        })
      }
    }
    for (const item of listToAdd) {
      await Repository.insertDataCalc(item)
    }
  }

  private static getPlanningDuration(
    hours: { start: string; end: string }[]
  ): number {
    let result = 0
    if (!hours || !hours.length) {
      return this.DEFAULT_SECOND_WORK // cas des codes absence
    }
    for (const hour of hours) {
      let endSecond = getDurationSecondFromTime(hour.end)
      const startSecond = getDurationSecondFromTime(hour.start)
      if (endSecond < startSecond) {
        endSecond += 24 * 60 * 60 // cas des heures passe-minuit, on rajoute 24h à l'heure de fin
      }
      result += endSecond - startSecond
    }
    return result
  }

  public static async getDispoDuration(
    date: string,
    userId: number,
    transaction = null
  ) {
    let user = await Repository.getDataWeek([userId], date, true, transaction)
    if (!user || !user.length) {
      return null
    }
    user = user[0]
    return await this.substractDuration(
      user.planning_duration_reel,
      date,
      userId,
      transaction
    )
  }

  public static async substractDuration(
    planningDurationReel: number,
    date,
    userId,
    transaction = null
  ) {
    let result = planningDurationReel

    const allAbsenceUser = await Repository.getAllAbsenceUser(
      date,
      userId,
      transaction
    )
    if (allAbsenceUser && allAbsenceUser.length > 0) {
      for (const absence of allAbsenceUser) {
        result -= getDurationSecondFromTime(absence.duration)
      }
    }

    const allChantier = await userChantierRepository.findAllChantierByUser(
      userId,
      date,
      transaction
    )
    if (allChantier && allChantier.length > 0) {
      for (const chantier of allChantier) {
        result -= getDurationSecondFromTime(chantier.duration)
      }
    }

    const allMainOeuvre = await mainOeuvreRepository.findAllMainOeuvreCedee(
      date,
      userId,
      transaction
    )
    if (allMainOeuvre && allMainOeuvre.length > 0) {
      for (const mainOeuvre of allMainOeuvre) {
        result -= getDurationSecondFromTime(mainOeuvre.duration)
      }
    }

    return result
  }

  public static async isEcartAlert(
    ecart_end: string,
    ecart_start: string,
    dispoDuration: number
  ) {
    if (dispoDuration < 0) {
      let tpsDuration = dispoDuration
      if (ecart_end) {
        const ecartEndSeconde = getDurationSecondFromTime(ecart_end)
        tpsDuration += ecartEndSeconde
      }
      if (ecart_start) {
        const ecartStartSeconde = getDurationSecondFromTime(ecart_start)
        tpsDuration += ecartStartSeconde
      }
      if (tpsDuration < 0) {
        return 1
      }
    }
    return 0
  }

  static async findAllByUserAndDate(idUser: number, days: string[], transaction) {
    return Repository.findAllByUserAndDate(idUser, days, transaction)
  }

  static async addList(userPlannings: any, transaction) {
    try {
      for (const userPlanning of userPlannings) {
        await Repository.addUserPlanning(userPlanning, transaction)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  static async getUserPlanningDefault(userId: number, date: string, transaction = null) {
    return Repository.findUserPlanningDefault(userId, date, transaction)
  }
}

export default Service
