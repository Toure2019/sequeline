/* eslint-disable @typescript-eslint/camelcase */
import models from '..'
import logger from '../../util/logger'
import { DATEFORMAT, now } from '../../util/util'


class Repository {
  static async findAll(chantierId, date?): Promise<any> {
    try {
        const criteria = date 
        ? { where: { t_inter_chantier_id: chantierId, date_rapport: date } }
        : { where: { t_inter_chantier_id: chantierId } }

        return await models.Rapport.findAll({
        ...criteria,
        order: [['date_rapport', 'ASC']],
        distinct: true,
        raw: true,
        nest: false,
      })
    } catch (err) {
      logger.debug(err.message)
    }
  }

  static async findDataRapport(idRapport: number) {
      return await models.RapportData.findAll({where: {t_rapport_inter_chantier_id: idRapport }})
  }

  static async upsert(rapport: any, transaction) {
    if (rapport.id) {
        rapport.date_update = now(DATEFORMAT)
        return await models.Rapport.update(rapport, {where: {id: rapport.id}, transaction})
    } else {
        delete rapport.id
        return await models.Rapport.create(rapport, {transaction})
    }
  }

  static async updateRapportDatas(idRapport: number, rapportDatas: any[], transaction) {
    await models.RapportData.destroy({where: { t_rapport_inter_chantier_id: idRapport }, transaction})
    return await models.RapportData.bulkCreate(rapportDatas)
  }

  static async deleteRapports(chantierId: number, date: any, transaction) {
      return models.Rapport.destroy({where: { t_inter_chantier_id: chantierId, date_rapport: date}, transaction})
  }

  static async deleteRapportsData(chantierId: number, date: any, transaction) {
    return models.RapportData.destroy({where: { t_inter_chantier_id: chantierId, date_rapport: date}, transaction})
}
}

export default Repository
