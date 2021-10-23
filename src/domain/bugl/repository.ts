import models from '../index'
import paginate from '../../util/database'
import { QueryTypes } from 'sequelize'
import sequelize from '../../database/connection'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC'
  ): Promise<any> {
    const result: any = await models.Bugl.findAndCountAll({
      where: {
        enabled: 1
      },
      order: [[orderByCol, direction]],
      raw: true,
      ...paginate(page, pageSize)
    })
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
    const { offset, limit } = paginate(page, pageSize)
    const filteredResult = await sequelize.query(
      `select * from t_bugl where enabled=1 AND (code||libelle||libelle_min) like '%${keyword}%'  ORDER BY ${orderByCol} ${direction} limit ${limit} offset ${offset}`,
      { model: models.Bugl, type: QueryTypes.SELECT }
    )

    const resultWithoutPaging = await sequelize.query(
      `select * from t_bugl where enabled=1 AND (code||libelle||libelle_min) like '%${keyword}%'  ORDER BY ${orderByCol} ${direction}`,
      { model: models.Bugl, type: QueryTypes.SELECT, raw: true }
    )
    const countUnfiltered = await models.Bugl.count({
      where: {
        enabled: 1
      }
    })
    const formattedResult = {
      rows: filteredResult,
      page,
      pageSize,
      recordsTotal: countUnfiltered,
      recordsFiltered: resultWithoutPaging.length
    }
    return formattedResult
  }
}

export default Repository
