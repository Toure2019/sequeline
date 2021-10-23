/* eslint-disable @typescript-eslint/camelcase */
import Repository from '../repository/Chantier'
import chantierSchema from '../schema/chantier'
import UserService from '../../user/service/user'
import UserChantierService from './userChantier'
import CompteService from '../../compte/service'
import EnginService from '../../engin/service'
import EnginChantierService from './enginChantier'
import moment from 'moment'
import { getDates, get422Error, DATEFORMAT, getDatesWeek } from '../../../util/util'
import { DAYNTERVAL } from '../../../util/util'
import ChantierDataCalc from '../models/chantierDataCalc'
import DB from '../../../database/connection'

const cprMin = ['T J', 'T N', 'HDJS J', 'HDJS N']

class Service {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    equipeId: string[],
    numSemaine: number,
    annee: number
  ): Promise<any> {
    let result: any = await Repository.findAll(
      page,
      pageSize,
      orderByCol,
      direction,
      equipeId,
      numSemaine,
      annee
    )

    if (await this.checkChantierDataCalc(result.rows)) {
      result = await Repository.findAll(
        page,
        pageSize,
        orderByCol,
        direction,
        equipeId,
        numSemaine,
        annee
      )
    }
    return result
  }

  static async findAllToDuplicate(equipeId: number, numSemaine: number, annee: number) {
    return await Repository.findAllToDuplicate(equipeId, numSemaine, annee)
  }

  static async checkChantierDataCalc(rows) {
    let updateDataCalc = false
    for (const elem of rows) {
      if (!elem.t_chantier_data_calc && elem.t_chantier_data_calc === null) {
        elem.t_chantier_data_calc = await this.processChantierDataCalc(elem, null, true)
        await Repository.addDataCalc(elem.t_chantier_data_calc)
        updateDataCalc = true
      }
    }

    return updateDataCalc
  }

  static findAllUsersByChantier(chantierId: number) {
    return Repository.findAllUsersByChantier(chantierId)
  }

  static findCalcByweekEquipes(equipe: any, semaine: number, annee: number) {
    return Repository.findCalcByweekEquipes(equipe, semaine, annee)
  }

  static findAllCalculations(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    chantierId: string
  ): Promise<any> {
    return Repository.findCalcByChantier(
      page,
      pageSize,
      orderByCol,
      direction,
      chantierId
    )
  }

  static async update(chantier: any): Promise<any> {
    const transaction = await DB.transaction()
    try {
      await Repository.update(chantier, transaction)
      const chantierDataCalc = await this.processChantierDataCalc(
        chantier,
        null,
        true
      )
      await Repository.updateDataCalc(chantierDataCalc, transaction)
      transaction.commit()

      return chantier
    } catch (err) {
      // Rollback transaction only if the transaction object is defined
      console.error(err)
      if (transaction) await transaction.rollback()
    }
  }

  static async updateDataCalc(chantierDataCalc, transaction) {
    return await Repository.updateDataCalc(chantierDataCalc, transaction)
  }

  static async updateChantierCommentaire(chantierId: number, commentaire: string): Promise<any> {
    const chantier = await Repository.findOneById(chantierId)
    if (chantier) {
      return Repository.updateCommentaire(chantierId, commentaire || '')
    } else {
      throw new Error(
        'Impossible de mettre à jour le commentaire du chantier: ${chantierId}'
      )
    }
  }

  static async validateRequest(data: any) {
    const response = chantierSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async getDetailChantierDurationForUsers(
    equipeId: number,
    chantierId: number,
    date: string
  ) {
    //get users
    const users = await UserService.findAllbyEquipe(
      null,
      null,
      'id',
      'asc',
      equipeId
    )
    //todo Filter users by Equipe
    let userIds = users.rows.map(o => o.id)

    let extUsers = await UserChantierService.findExtUsers(chantierId, userIds)

    if (extUsers.length) {
      extUsers = extUsers.map(o => o.t_user_planning_t_user_id)
      userIds = userIds.concat(extUsers)
    }
    
    const DurationsByUsers = []

    for (let i = 0; i < userIds.length; i++) {
      const result = await Repository.getDetailChantierDurations(
        chantierId,
        userIds[i],
        date
      )
      if (result && result.length > 0)
        DurationsByUsers.push({ userId: userIds[i], data: result })
    }
    const durations = await Repository.getDurationsByDay(chantierId, date)
    const adaptedRes = this.adaptDurations(DurationsByUsers, date)
    const ressourcesChantier = await EnginChantierService.findAllByChantier(chantierId)
    const adaptedRessources = await this.adaptRessources(chantierId, ressourcesChantier)
    const chantier = await Repository.findOneById(chantierId)
    return { chantier, durations, DurationsByDays: adaptedRes, engins: adaptedRessources, externalUsers: extUsers }
  }

  static async adaptRessources(chantierId: number, ressourcesChantier) {
    const result = []
    const engins = new Set<any>()
    const byEngin = new Map<any, any[]>()
    for (const resChantier of ressourcesChantier) {
      let existant = byEngin.get(resChantier.t_engin_id)
      if (!existant) {
        existant = []
      }
      existant.push({ date: resChantier.date, value: resChantier.value })
      engins.add(await EnginService.findOneById(resChantier.t_engin_id))
      byEngin.set(resChantier.t_engin_id, existant)
    }
    byEngin.forEach((value, key) => {
      let engin
      engins.forEach(e => {
        if (e.id === key) {
          engin = e
        }
      })
      const toAdd = {
        t_inter_chantier_id: chantierId,
        t_engin: engin,
        days: value
      }
      result.push(toAdd)
    })
    return result
  }

  static async findOneById(id: number) {
    return Repository.findOneById(id)
  }

  static async delete(id: number) {
    const transaction = await DB.transaction()
    try {
      await EnginChantierService.removeListRessources(id)
      await Repository.deleteDataCalc(id)
      const result = await Repository.delete(id)
      transaction.commit()
      return result
    } catch (err) {
      // Rollback transaction only if the transaction object is defined
      console.error(err)
      if (transaction) await transaction.rollback()
    }
  }

  static async save(chantier: any, date: any, needSave: boolean = true, transaction = null) {
    const chantierId = await Repository.exist(chantier)
    if (chantierId) {
      if (needSave) {
        throw new Error('Le chantier existe déjà !')
      }
      return chantierId
    } else {
      let compte = (await CompteService.findOneById(
        chantier.t_compte_id
      )) as any
      if (compte !== undefined && compte !== null) {
        compte = this.adaptIdentifiantWithRg(chantier, compte)
        const compteErp = await CompteService.findCompteErpBy(
          compte.pc,
          compte.projet,
          compte.activite,
          date
        )
        if (
          compteErp !== undefined &&
          compteErp !== null &&
          compteErp.version !== '' &&
          (await CompteService.existCompteAccessible(
            compte.pc,
            compte.projet,
            compte.activite,
            date
          ))
        ) {
          if (
            compte.localisable === 1 &&
            compte.pc !== 'PC009' &&
            (chantier.t_segment_gestion_id === '' ||
              chantier.t_segment_gestion_id === '-1')
          ) {
            throw new Error('Ce chantier nécessite un segment de gestion !')
          }
          chantier.t_compte_erp_id = compteErp.id

          const toCommit = false
          if (!transaction) {
            transaction  = await DB.transaction()
          }
          try {
            const chantierAdded = await Repository.add(chantier, transaction)
            const chantierDataCalc = await this.processChantierDataCalc(
              chantierAdded,
              compte,
              false
            )
            await Repository.addDataCalc(chantierDataCalc, transaction)
            if (toCommit) {
              transaction.commit()
            }

            return chantierAdded
          } catch (err) {
            // Rollback transaction only if the transaction object is defined
            console.error(err)
            if (transaction) await transaction.rollback()
          }
        } else {
          throw new Error(
            'Ce chantier ne peut pas être créé car il ne fait pas parti de l\'ERP !'
          )
        }
      }
    }
  }

  static adaptIdentifiantWithRg(chantier, compte) {
    if (chantier.rg_pointage && chantier.rg_pointage !== '') {
      compte.projet = compte.projet.replace('|RG|', chantier.rg_pointage)
      compte.activite = compte.activite.replace('|RG|', chantier.rg_pointage)
    }
    return compte
  }

  static async processChantierDataCalc(
    chantier,
    compte,
    isUpdate,
    transaction?
  ): Promise<ChantierDataCalc> {
    //TODO: ajout gestion spot (voir processweek dans classChantierDataCalc)
    const chantierDataCalc: any = {}
    chantierDataCalc.t_inter_chantier_id = chantier.id
    chantierDataCalc.nbr_uop = isUpdate ? await this.getNbrUop(chantier.id) : 0
    chantierDataCalc.duration = isUpdate
      ? await this.getDuration(chantier.id)
      : 0
    chantierDataCalc.spot_exist = 0
    chantierDataCalc.durationTotal = chantierDataCalc.duration
    chantierDataCalc.cpr = cprMin[chantier.t_cpr_id - 1]
    chantierDataCalc.axe_local = chantier.axe_local
    chantierDataCalc.rg_pointage = chantier.rg_pointage

    if (compte === null) {
      compte = (await CompteService.findOneById(chantier.t_compte_id)) as any
    }
    if (chantierDataCalc.durationTotal === 0) {
      chantierDataCalc.check_rapport = 0
    } else if (!this.checkListRapport(chantier.id, compte, isUpdate)) {
      chantierDataCalc.check_rapport = 1
    } else {
      chantierDataCalc.check_rapport = 2
    }

    const uop = isUpdate ? await this.getDataCalcNbrUop(chantier.id, transaction) : []
    chantierDataCalc.nbr_uop = isUpdate ? uop.reduce((sum, value) => sum + value.nbr_uop, 0) : 0

    const dataByDays = await this.adaptByDays(chantier, transaction)

    chantierDataCalc.nbr_uop_days = JSON.stringify(dataByDays.uops)
    chantierDataCalc.duration_days = JSON.stringify(dataByDays.durations)
    chantierDataCalc.rapport_days = JSON.stringify(dataByDays.rapports)
  
    return chantierDataCalc
  }

  static async adaptByDays(chantier, transaction?) {
    const uopData = await this.getDataCalcNbrUop(chantier.id, transaction)
    const durationData = await this.getDataCalcDuration(chantier.id)
    const rapportData = await this.getDataCalcNbrUop(chantier.id, transaction)
    const uops = {'6':0,'7':0,'1':0,'2':0,'3':0,'4':0,'5':0}
    const durations = {'6':0,'7':0,'1':0,'2':0,'3':0,'4':0,'5':0}
    const rapports = {'6':0,'7':0,'1':0,'2':0,'3':0,'4':0,'5':0}
    if (uopData && uopData.length > 0) {
      const dates = getDatesWeek(moment(uopData[0]?.date_rapport).format(DATEFORMAT))
      const days = [6, 7, 1, 2, 3, 4, 5]
      let i = 0
      for (const date of dates) {
        const uop = uopData.filter((e) => date === moment(e.date_rapport).format(DATEFORMAT))
        const duration = durationData.filter((e) => date === moment(e.t_user_planning_date).format(DATEFORMAT))
        const rapport = rapportData.filter((e) => date === moment(e.date_rapport).format(DATEFORMAT))
        uops[days[i]] = uop.length > 0 ? uop.reduce((sum, value) => sum + value.nbr_uop, 0) : 0
        durations[days[i]] = duration.length > 0 ? duration.reduce((sum, value) => sum + Number(value.dur), 0) : 0
        rapports[days[i]] = rapport.length > 0 ? rapport.length : 0
        i += 1
      }
    }
    return {uops, durations, rapports}
  }

  static async getNbrUop(chantierId: number) {
    return await Repository.getNbrUop(chantierId)
  }

  static async getDuration(chantierId: number) {
    let result = 0
    const duration = await Repository.getDuration(chantierId)
    if (duration.length > 0) {
      result = duration[0].dur
    }
    return result
  }

  static async getDurationDiplay(chantierId: number) {
    let result = '00:00'
    const duration = await Repository.getDuration(chantierId)
    if (duration.length > 0) {
      const durationSec = duration[0].dur
      const hours = Math.floor(durationSec / 3600)
      const minutes = Math.floor((durationSec - hours * 3600) / 60)
      let strHours = hours.toString()
      strHours = strHours.length === 1 ? `0${strHours}` : strHours
      let strMinutes = minutes.toString()
      strMinutes = strMinutes.length === 1 ? `0${strMinutes}` : strMinutes
      result = `${strHours}:${strMinutes}`
    }
    return result
  }

  static async checkListRapport(
    chantierId: number,
    compte: any,
    isUpdate: boolean
  ) {
    if (compte.need_rapport === 0) {
      return true
    } else if (isUpdate) {
      const datesUser = await Repository.getUserPlanningDates(chantierId)
      const datesRapport = await Repository.getRapportPlanningDates(chantierId)
      if (compte.need_rapport === 1) {
        for (const date of datesUser) {
          if (datesRapport.indexOf(date) === -1) {
            return false
          }
        }
        return true
      } else if (compte.need_rapport === 2) {
        for (const date of datesUser) {
          if (datesRapport.indexOf(date) !== -1) {
            return true
          }
        }
        return false
      }
    }
    return false
  }

  static async getDataCalcNbrUop(chantierId: number, transaction?) {
    return await Repository.getDataCalcNbrUop(chantierId, transaction)
  }

  static async getDataCalcDuration(chantierId: number) {
    return await Repository.getDataCalcDuration(chantierId)
  }

  static adaptDurations(durations, date) {
    const weekDates = getDates(
      moment(date)
        .tz('Europe/Paris')
        .startOf('week'),
      moment(date)
        .tz('Europe/Paris')
        .endOf('week'),
      DAYNTERVAL
    )
    const data = []
    weekDates.forEach(element => {
      element = element.replace(/'/g, '')
      const obj: any = {}
      obj.date = element
      obj.userData = []
      durations.forEach(elem => {
        elem.data.forEach(item => {
          if (
            moment(item.t_user_planning_date).format(DATEFORMAT) ==
            moment(element).format(DATEFORMAT)
          ) {
            obj.userData.push({ userId: elem.userId, ...item })
          }
        })
      })
      data.push(obj)
    })
    return data
  }
}

export default Service
