/* eslint-disable @typescript-eslint/camelcase */
import logger from '../../../util/logger'
import EvsGroupSettings from '../models/evsGroupSettings'
import DB from '../../../database/connection'
import { QueryTypes } from 'sequelize'

class Repository {
  static async findAll(codeEtablissement: string): Promise<any> {
    const query =
      'select * from t_evs_group_settings ' +
      `where (grp = '' or id in (select t_evs_group_settings_id from t_evs_field_rules where enable_in_settings = '1' and t_etablissement_code = '${codeEtablissement}')) ` +
      `and t_etablissement_code = '${codeEtablissement}' ` +
      'order by position, libelle '

    let result: any
    try {
      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      logger.debug(err.message)
    }
    return result
  }

  static async update(evsGroupSettings: any) {
    return EvsGroupSettings.update(evsGroupSettings, {
      where: { id: evsGroupSettings.id }
    })
  }

  static async add(evsGroupSettings: any, codeEtablissement: string) {
    let group: any

    group = await this.findOneBygrp(evsGroupSettings.grp, codeEtablissement)

    if (group) {
      return group
    }

    group = await EvsGroupSettings.create({
      ...evsGroupSettings,
      t_etablissement_code: codeEtablissement
    })

    return group.toJSON()
  }

  static async findOneByCode(id: string) {
    return EvsGroupSettings.findOne({ where: { id: id } })
  }

  static async delete(id: number) {
    return EvsGroupSettings.destroy({ where: { id } })
  }

  static async findOneBygrp(grp: string, t_etablissement_code) {
    return EvsGroupSettings.findOne({
      raw: true,
      where: { grp: grp, t_etablissement_code }
    })
  }
}

export default Repository
