/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import Departement from './model'
import logger from '../../util/logger'
import { DATEFORMAT, now } from '../../util/util'
import { Sequelize, Op, QueryTypes } from 'sequelize'
import sequelize from '../../database/connection'
import moment from 'moment-timezone'
import RgRepository from './../Rg/repository'

class Repository {
  static async findAll(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC',
    codeEtablissement: string
  ): Promise<any> {
    const { offset, limit } = paginate(page, pageSize)

    let whereEtablissementRequest = 'where 1 = 1'
    if (codeEtablissement) {
      whereEtablissementRequest = `where (t_etablissement_code = '${codeEtablissement}')`
    }

    const enabledSearch = keyword
      ? `AND (t_user.nom ilike '%${keyword}%' or prenom ilike '%${keyword}%' or t_equipe.nom ilike '%${keyword}%' or num_equipe ilike '%${keyword}%' or t_user.login ilike '%${keyword}%')`
      : ''
    const currentDate = moment()
      .tz('Europe/Paris')
      .format('YYYY-MM-DD')

    if (orderByCol == 'id') {
      orderByCol = 't_departement.id'
    }

    const query = `select * from t_departement where 
    t_departement.date_effet <= '${currentDate}' and t_departement.date_effet_end > '${currentDate}'
    and code in (select coalesce(t_user_properties.t_departement_code, t_uo.t_departement_code) AS code 
    from t_uo full join t_user_properties ON t_uo.code = t_user_properties.t_uo_code 
    ${whereEtablissementRequest}
    AND t_user_properties.date_effet <= '${currentDate}' and t_user_properties.date_effet_end > '${currentDate}'
    AND t_uo.date_effet <= '${currentDate}' and t_uo.date_effet_end > '${currentDate}')
    and enabled = '1'
    ${enabledSearch}
    ORDER BY ${orderByCol} ${direction}
    LIMIT ${limit} OFFSET ${offset}`

    const resultFiltered = await sequelize.query(query, {
      type: QueryTypes.SELECT
    })

    const queryCountUnFiltered = `select count(*) from t_departement where 
    t_departement.date_effet <= '${currentDate}' and t_departement.date_effet_end > '${currentDate}'
    and code in (select coalesce(t_user_properties.t_departement_code, t_uo.t_departement_code) AS code 
    from t_uo full join t_user_properties ON t_uo.code = t_user_properties.t_uo_code 
    ${whereEtablissementRequest}
    AND t_user_properties.date_effet <= '${currentDate}' and t_user_properties.date_effet_end > '${currentDate}'
    AND t_uo.date_effet <= '${currentDate}' and t_uo.date_effet_end > '${currentDate}')
    and enabled = '1'
    ${enabledSearch}`

    const countUnFiltered = await sequelize.query(queryCountUnFiltered, {
      type: QueryTypes.SELECT
    })

    for (let i = 0; i < resultFiltered.length; i++) {
      const rg = await RgRepository.findOneByCode(
        resultFiltered[i]['t_rg_code']
      )

      if (rg) {
        resultFiltered[i]['rg'] = `${rg.code} ${rg.libelle}`
      }
    }

    const result = {
      rows: resultFiltered,
      page,
      pageSize,
      recordsTotal: countUnFiltered[0]['count'],
      recordsFiltered: countUnFiltered[0]['count']
    }

    return result
  }

  static async search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC',
    codeEtablissement: string,
    noPaging: boolean
  ): Promise<any> {
    const pagination = !noPaging ? paginate(page, pageSize) : {}
    let resultFiltered: any
    let unfilteredCount: number
    const ordering = this.getOrdering(orderByCol, direction)
    let etablissementCriteria = {}
    if (codeEtablissement) {
      etablissementCriteria = await this.getEtablissementCriteria(
        codeEtablissement
      )
    }

    try {
      resultFiltered = await models.Departement.findAndCountAll({
        where: {
          [Op.and]: Sequelize.literal(
            `t_departement.enabled=1 AND (t_departement.code||t_departement.libelle||t_departement.libelle_min||t_rg.code||t_rg.libelle) like '%${keyword}%'`
          ),
          enabled: 1,
          ...etablissementCriteria
        },
        order: ordering,
        raw: false,
        nest: true,
        distinct: true,
        include: [
          {
            model: models.Rg,
            attributes: ['code', 'libelle']
          }
        ],
        ...pagination
      })

      unfilteredCount = await models.Departement.count({
        where: {
          enabled: 1
        },
        order: ordering,
        raw: false,
        nest: true,
        include: [
          {
            model: models.Rg,
            attributes: ['code', 'libelle']
          }
        ]
      })
    } catch (err) {
      logger.debug(err.message)
    }
    const formattedResult = {
      rows: resultFiltered.rows,
      page,
      pageSize,
      recordsTotal: unfilteredCount,
      recordsFiltered: resultFiltered.count
    }
    return formattedResult
  }

  static getOrdering(orderByCol, direction) {
    const ordering = []
    if (orderByCol === 't_rg') {
      ordering.push([models.Rg, 'libelle', direction])
    } else {
      ordering.push([orderByCol, direction])
    }
    return ordering
  }

  static async getEtablissementCriteria(codeEtablissement) {
    try {
      const today = now(DATEFORMAT)
      let etabDepartementCodes = await models.UO.findAll({
        attributes: [
          [
            Sequelize.fn(
              'DISTINCT',
              Sequelize.fn(
                'COALESCE',
                Sequelize.col('t_user_properties.t_departement_code'),
                Sequelize.col('t_uo.t_departement_code')
              )
            ),
            'code'
          ]
        ],
        raw: true,
        where: {
          t_etablissement_code: codeEtablissement,
          date_effet: {
            [Op.lte]: today
          },
          date_effet_end: {
            [Op.gte]: today
          },
          '$t_user_properties.date_effet$': {
            [Op.lte]: today
          },
          '$t_user_properties.date_effet_end$': {
            [Op.gte]: today
          }
        },
        distinct: true,
        include: [
          {
            model: models.UserProperties,
            attributes: ['t_uo_code', 't_departement_code'],
            as: 't_user_properties'
          }
        ]
      })

      etabDepartementCodes = etabDepartementCodes.map(r => {
        return r.code
      })

      const etablissementCriteria =
        etabDepartementCodes.length > 0
          ? {
              code: {
                [Op.in]: etabDepartementCodes
              }
            }
          : {}

      return etablissementCriteria
    } catch (err) {
      console.error(err)
    }
  }

  static async update(dep: Departement) {
    return Departement.update(dep, { where: { code: dep.code } })
  }

  static async findOneByCode(code: string) {
    return Departement.findOne({ where: { code } })
  }

  static async findByFilter(favori: boolean, uos: any[]) {
    const today = now(DATEFORMAT)

    const favoriCriteria = !favori
      ? {}
      : {
          code: {
            [Op.in]: uos
          }
        }

    return Departement.findAll({
      where: {
        enabled: 1,
        date_effet: {
          [Op.lte]: today
        },
        date_effet_end: {
          [Op.gte]: today
        },
        ...favoriCriteria
      },
      order: [['libelle', 'ASC']]
    })
  }
}

export default Repository
