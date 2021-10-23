import paginate from '../../util/database'
import models from '..'
import { Sequelize } from 'sequelize'
import { Op } from 'sequelize'
import logger from '../../util/logger'
import Engin from './model'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC'
  ): Promise<any> {
    let result: any
    try {
      result = await models.Engin.findAndCountAll({
        order: [[orderByCol, direction]],
        raw: false,
        nest: true,

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
    orderByCol: string = 'id',
    direction: string = 'ASC'
  ): Promise<any> {
    const resultFiltered = await models.Engin.findAndCountAll({
      where: {
        [Op.and]: Sequelize.literal(`(t_engin.id||t_engin.code||t_engin.libelle) like '%${keyword}%' `)
      },
      order: [[orderByCol, direction]],
      raw: false,
      nest: true,

      ...paginate(page, pageSize)
    })

    const countUnFiltered = await models.Engin.count({
      order: [[orderByCol, direction]],
      raw: false,
      nest: true
    })

    return {
      rows: resultFiltered.rows,
      page,
      pageSize,
      recordsTotal: countUnFiltered,
      recordsFiltered: resultFiltered.count
    }
  }

  static async update(engin: any) {
    return Engin.update(engin, { where: { id: engin.id } })
  }

  static async delete(id: number) {
    return Engin.destroy({ where: { id } })
  }

  static async findOneById(id: number) {
    return Engin.findOne({ raw: true, where: { id } })
  }

  static async add(engin: any) {
    return Engin.create(engin)
  }

  static async findByFilter(all: string, favori: boolean, uos: any[]) {
    let boolAll: boolean
    try {
      boolAll = JSON.parse(all)
    } catch (err) {
      console.error(err)
    }
    
    const allCriteria = boolAll === false ?
      { statut: 1 } :
      { }
    
    const favoriCriteria = !favori ?
      { } :
      { id: {
        [Op.in]: uos
      }}

    return Engin.findAll({
      where: {
        ...allCriteria,
        ...favoriCriteria
      },
      order:[['libelle', 'ASC']],
    })

  }
}

export default Repository
