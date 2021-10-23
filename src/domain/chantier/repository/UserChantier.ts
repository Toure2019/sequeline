/* eslint-disable @typescript-eslint/camelcase */
import models from '../../index'
import { Op } from 'sequelize'

class UserChantierRepository {
  
  static async updateUserChantier(userChantier, transaction = null) {
    return models.UserChantier.update(userChantier, { transaction: transaction, individualHooks: true })
  }

  static async deleteUserChantier(idChantier: number, idUser: number, date: string, transaction = null) {
    return models.UserChantier.destroy({
      where: {
        t_inter_chantier_id: idChantier,
        t_user_planning_t_user_id: idUser,
        t_user_planning_date: date
      },
      transaction: transaction
    })
  }

  static async addUserChantier(userChantier, transaction = null) {
    return models.UserChantier.upsert(userChantier, {transaction: transaction, individualHooks: true})
  }

  static async findOneById(idChantier: number, idUser: number, date: string) {
    return models.UserChantier.findOne({
      where: {
        t_inter_chantier_id: idChantier,
        t_user_planning_t_user_id: idUser,
        t_user_planning_date: date
      }
    })
  }

  static async findExtUsers(idChantier: number, usersId: number[]) {
    return models.UserChantier.findAll({
      attributes: ['t_user_planning_t_user_id'],
      where: {
        t_inter_chantier_id: idChantier,
        t_user_planning_t_user_id: {
          [Op.notIn]: usersId
        },
      },
      raw: true
    })
  }

  static async findAllChantierByUser(idUser: number, date: string, transaction = null) {
    const result = await models.UserChantier.findAll({
      where: {
        t_user_planning_t_user_id: idUser,
        t_user_planning_date: date
      },
      nest: true,
      raw: true,
      include: [{ model: models.Chantier, include: [{ model: models.Compte }, { model: models.SousEquipe }] }],
      transaction: transaction
    })

    const formatedResult = result.map(element => {
      element.compte_nom = element.t_inter_chantier.t_compte.nom
      element.compte_designation = element.t_inter_chantier.t_compte.designation
      element.nom_equipe = element.t_inter_chantier.t_equipe.nom
      element.no_productif = element.t_inter_chantier.t_compte.no_productif
      delete element.t_inter_chantier
      return element
    })

    return formatedResult
  }

  static async findAllByChantierAndUser(idUser: number, idChantier: number, transaction = null) {
    return await models.UserChantier.findAll({
      where: {
        t_user_planning_t_user_id: idUser,
        t_inter_chantier_id: idChantier
      },
      nest: true,
      raw: true,
      transaction: transaction
    })
  }

  static async updateDataCalcDuration(chantierId: number, newDuration: number, add = false, transaction = null) {
    try {
      const calcChantier = await models.ChantierDataCalc.findOne({
          where: {
            t_inter_chantier_id: chantierId,
          },
          transaction
      })
      calcChantier.duration = add ? newDuration + calcChantier.duration : newDuration
      await calcChantier.save({ transaction })
        return calcChantier
    } catch (err) {
      console.error(err)
    }
  }
}

export default UserChantierRepository
