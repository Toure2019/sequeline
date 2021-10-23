/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../../util/database'
import models from '../..'
import logger from '../../../util/logger'
import EvsGroupRapport from '../models/evsGroupRapport'
import DB from '../../../database/connection'
import { QueryTypes } from 'sequelize'

class Repository {
  static async findAll(codeEtablissement: string): Promise<any> {
    const query = `select * from t_evs_group_rapport 
       where (grp = '' or id in (select t_evs_group_rapport_id from t_evs_field_rules where enable_in_rapport = '1' and t_etablissement_code = '${codeEtablissement}')) 
      and t_etablissement_code = '${codeEtablissement}'
      order by position, libelle`

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

  static async findById(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    id: string
  ): Promise<any> {
    let result: any
    try {
      result = await models.EvsGroupRapport.findOne({
        where: { id: id },
        order: [[orderByCol, direction]],
        raw: false,
        nest: true,
        ...paginate(page, pageSize)
      })
    } catch (err) {
      logger.debug(err.message)
    }

    return {
      rows: result,
      page,
      pageSize,
      recordsTotal: result.length,
      recordsFiltered: result.length
    }
  }

  static async update(evsGroupSettings: any) {
    return EvsGroupRapport.update(evsGroupSettings, {
      where: { id: evsGroupSettings.id }
    })
  }

  static async add(evsGroupRapport: any, codeEtablissement: string) {
    let group: any

    group = await this.findOneBygrp(evsGroupRapport.grp, codeEtablissement)
    if (group) {
      return group
    }

    group = await EvsGroupRapport.create({
      ...evsGroupRapport,
      t_etablissement_code: codeEtablissement
    })

    return group.toJSON()
  }

  static async findOneByCode(id: string) {
    return EvsGroupRapport.findOne({ where: { id: id } })
  }
  static async delete(id: number) {
    return EvsGroupRapport.destroy({ where: { id } })
  }

  static async findOneBygrp(grp: string, codeEtablissement: string) {
    return EvsGroupRapport.findOne({
      raw: true,
      where: { grp: grp, t_etablissement_code: codeEtablissement }
    })
  }
}

export default Repository
