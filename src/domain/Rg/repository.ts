/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import Rg from './model'
import { Sequelize, QueryTypes } from 'sequelize'
import { Op } from 'sequelize'
import logger from '../../util/logger'
import RgData from './typeModel'
import DB from '../../database/connection'
import { DATEFORMAT, now } from '../../util/util'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC'
  ): Promise<any> {
    let result: any
    const ordering = this.getOrdering(orderByCol, direction)

    try {
      const currentDate = now(DATEFORMAT)
      result = await models.Rg.findAndCountAll({
        where: {
          enabled: 1,

          date_effet: {
            [Op.lte]: currentDate
          },
          date_effet_end: {
            [Op.gt]: currentDate
          }
        },
        order: ordering,
        raw: false,
        nest: true,
        include: [
          {
            model: models.Division,
            attributes: ['code', 'libelle']
          },
          {
            model: models.RgData
          }
        ],

        ...paginate(page, pageSize)
      })
    } catch (err) {
      logger.debug(err.message)
    }

    return {
      ...result,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static async search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC'
  ): Promise<any> {
    const ordering = this.getOrdering(orderByCol, direction)
    const currentDate = now(DATEFORMAT)

    const resultFiltered = await models.Rg.findAndCountAll({
      where: {
        date_effet: {
          [Op.lte]: currentDate
        },
        date_effet_end: {
          [Op.gt]: currentDate
        },
        [Op.and]: Sequelize.literal(
          `t_rg.enabled=1 AND ((t_rg.code||t_rg.libelle||t_rg.libelle_min||t_rg.t_division_code||t_division.libelle) like '%${keyword}%') `
        )
      },
      order: ordering,
      raw: false,
      nest: true,
      include: [
        {
          model: models.Division,
          attributes: ['code', 'libelle']
        },
        {
          model: models.RgData
        }
      ],

      ...paginate(page, pageSize)
    })

    const countUnFiltered = await models.Rg.count({
      where: {
        enabled: 1,
        date_effet: {
          [Op.lte]: currentDate
        },
        date_effet_end: {
          [Op.gt]: currentDate
        }
      },
      order: [[orderByCol, direction]],
      raw: false,
      nest: true,
      include: [
        {
          model: models.Division,
          attributes: ['code', 'libelle']
        }
      ]
    })

    return {
      rows: resultFiltered.rows,
      page,
      pageSize,
      recordsTotal: countUnFiltered,
      recordsFiltered: resultFiltered.count
    }
  }

  static getOrdering(orderByCol, direction) {
    const ordering = []
    if (orderByCol == 't_division') {
      ordering.push([models.Division, 'libelle', direction])
    } else if (orderByCol == 't_rg_datum') {
      ordering.push([models.RgData, 'rg_type', direction])
    } else {
      ordering.push([orderByCol, direction])
    }
    return ordering
  }

  static async update(rg: any) {
    return Rg.update(rg, { where: { code: rg.code } })
  }

  static async updateType(id: string, type: string) {
    const data = await RgData.findOne({ where: { t_rg_code: id }, raw: true })

    if (data) {
      return await RgData.update(
        { rg_type: type },
        { where: { t_rg_code: id } }
      )
    } else {
      return await RgData.upsert({ rg_type: type, t_rg_code: id })
    }
  }

  static async findOneByCode(code: string) {
    return Rg.findOne({ where: { code }, raw: true })
  }

  static async delete(code: string) {
    return Rg.destroy({ where: { code } })
  }

  static async findAllBy(codeEtablissement: string) {
    let result = []
    try {
      const today = now(DATEFORMAT)
      let andRequestDate = `and (date_effet <= CAST('${today}' AS DATE) and date_effet_end >= CAST('${today}' AS DATE)) `

      const andRequestDateDep = `and (t_departement.date_effet <= CAST('${today}' AS DATE) and t_departement.date_effet_end >= CAST('${today}' AS DATE)) `
      const andRequestDateUO = `and (t_uo.date_effet <= CAST('${today}' AS DATE) and t_uo.date_effet_end >= CAST('${today}' AS DATE)) `

      andRequestDate += `and code in (select t_rg_code from t_departement
        inner join t_uo on t_departement_code = t_departement.code
        where t_etablissement_code = '${codeEtablissement}' ${andRequestDateDep} ${andRequestDateUO} group by t_rg_code) `

      const request = `select * from t_rg where enabled = '1' ${andRequestDate} order by libelle;`

      result = await DB.query(request, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }
}

export default Repository
