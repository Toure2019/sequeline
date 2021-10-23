import Repository from '../repository/UserChantier'
import userChantierSchema from '../schema/userChantier'
import userPlanningService from './../../userPlanning/service'
import { get422Error } from './../../../util/util'
import DB from '../../../database/connection'
import moment from 'moment'

class Service {

  static update(enginChantier: any): Promise<any> {
    return Repository.updateUserChantier(enginChantier)
  }

  static async validateRequest(data: any) {
    const response = userChantierSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneById(idChantier: number, idUser: number, date: string) {
    return Repository.findOneById(idChantier, idUser, date)
  }

  static async delete(idChantier: number, idUser: number, date: string) {
    const transaction = await DB.transaction()
    try {
      const result = await Repository.deleteUserChantier(idChantier, idUser, date, transaction)
      await userPlanningService.updateDispoDuration(date, idUser, transaction)
      transaction.commit()
      return result
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static async updateDataCalcDuration(chantierId: number, duration: number, toAdd: boolean) {
    return await Repository.updateDataCalcDuration(chantierId, duration, toAdd)
  }

  static async addList(userChantiers: any, transaction = null) {
    const result = []
    let toCommit = false
    if (!transaction) {
      transaction = await DB.transaction()
      toCommit = true
    }
    try {
      let chDuration = 0
      for (const userChantier of userChantiers) {
        result.push(await Repository.addUserChantier(userChantier, transaction))
        await userPlanningService.updateDispoDuration(userChantier.t_user_planning_date, userChantier.t_user_planning_t_user_id, transaction)
        chDuration += moment.duration(userChantier.duration).asSeconds()
      }
      await Repository.updateDataCalcDuration(userChantiers[0].t_inter_chantier_id, chDuration, false, transaction)
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

  static async addOne(userChantier: any) {
    const transaction = await DB.transaction()
    try {
      const result = await Repository.addUserChantier(userChantier, transaction)
      await userPlanningService.updateDispoDuration(userChantier.t_user_planning_date, userChantier.t_user_planning_t_user_id, transaction)
      transaction.commit()
      const chDuration = moment.duration(userChantier.duration).asSeconds()
      await Repository.updateDataCalcDuration(userChantier.t_inter_chantier_id, chDuration, true)
      return result
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static async findAllChantierByUser(idUser: number, date: string) {
    return Repository.findAllChantierByUser(idUser, date)
  }

  static async findAllByChantierAndUser(idUser: number, idChantier: number, transaction) {
    return Repository.findAllByChantierAndUser(idUser, idChantier, transaction)
  }

  static async findExtUsers(idChantier: number, userIdArray: number[]) {
    return Repository.findExtUsers(idChantier, userIdArray)
  }

}

export default Service
