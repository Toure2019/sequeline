/* eslint-disable @typescript-eslint/camelcase */
import models from '../../index'

class EnginChantierRepository {

  static async addRessourceChantier(ressourceChantier: any, transaction = null) {
    return models.EnginChantier.upsert(ressourceChantier, {transaction: transaction})
  }

  static async deleteRessourceChantier(chantierId, transaction = null) {
    return models.EnginChantier.destroy({ where: { t_inter_chantier_id: chantierId } }, {transaction: transaction})
  }

  static async findOneById(id: string) {
    return models.EnginChantier.findOne({ where: { t_inter_chantier_id: id } })
  }

  static async findAllByChantier(chantierId: number) {
    return models.EnginChantier.findAll({
      raw: true,
      order: [['t_engin_id', 'ASC'], ['date', 'ASC']],
      where: {
        t_inter_chantier_id: chantierId
      }
    })
  }
}

export default EnginChantierRepository
