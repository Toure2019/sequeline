/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import { Sequelize, Op } from 'sequelize'
import models from '..'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC'
  ): Promise<any> {
    const result: any = await models.Division.findAndCountAll({
      where: { enabled: 1 },
      include: [
        {
          model: models.Bugl,
          attributes: ['code', 'libelle'],
          required: true
        }
      ],
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
    const resultFiltered = await models.Division.findAndCountAll({
      where: {
        [Op.and]: Sequelize.literal(
          `t_division.enabled=1 AND (t_division.code||t_division.libelle||t_division.libelle_min||t_bugl.code||t_bugl.libelle) like '%${keyword}%' `
        )
      },
      include: [
        {
          model: models.Bugl,
          attributes: ['code', 'libelle'],
          required: true
        }
      ],
      order: [[orderByCol, direction]],
      raw: true,
      ...paginate(page, pageSize)
    })

    const countUnfiltered = await models.Division.count({
      where: { enabled: 1 },
      include: [
        {
          model: models.Bugl,
          attributes: ['code', 'libelle']
        }
      ],
      order: [[orderByCol, direction]],
      raw: true,
      nest: true,
      ...paginate(page, pageSize)
    })

    return {
      rows: resultFiltered.rows,
      page,
      pageSize,
      recordsTotal: resultFiltered.count,
      recordsFiltered: countUnfiltered
    }
  }
}

export default Repository
