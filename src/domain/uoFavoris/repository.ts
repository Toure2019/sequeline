/* eslint-disable @typescript-eslint/camelcase */
import models from '../index'
import paginate from '../../util/database'
import { removeUndefined } from '../../util/util'
import { Op } from 'sequelize'
import UoFavoris from './model'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 't_table',
    direction: string = 'ASC',
    t_table: string,
    code: string,
    codeEtablissement: string,
    noPaging: boolean
  ): Promise<any> {
    const pagination = !noPaging ? paginate(page, pageSize) : {}
    const criteria = { t_table: t_table, t_table_id: code, t_etablissement_code: codeEtablissement }
    removeUndefined(criteria)
    const result: any = await models.UoFavoris.findAndCountAll({
      where: {
        ...criteria,
      },
      include: [{ model: models.UO }],
      order: [[orderByCol, direction]],
      raw: true,
      nest: true,
      ...pagination,
    })
    return {
      ...result,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count,
    }
  }

  static async createBulk(data: any) {
    return models.UoFavoris.bulkCreate(data, { ignoreDuplicates: true })
  }

  static async removeBulk(data: []) {
    data.forEach((element: any) => {
      models.UoFavoris.destroy({ where: { 
            t_table: element.t_table,
            t_table_id: element.t_table_id,
            t_etablissement_code: element.t_etablissement_code,
            t_uo_code: element.t_uo_code
         } 
      })
    })
  }
  
  static async findUoFavorisBy(codeEtablissement: string, table: string, uos: string[]) {
    const result = []
    const uoFav = await UoFavoris.findAll({
      attributes: ['t_table_id'],
      where: {
        t_table: table,
        t_etablissement_code: codeEtablissement,
        t_uo_code: {
          [Op.in]: uos
        }
      }
    })
    uoFav.forEach(item => {
      result.push(item.get('t_table_id'))
    })

    return result
  }
}

export default Repository
