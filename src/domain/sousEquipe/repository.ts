/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import { Sequelize, QueryTypes } from 'sequelize'
import { Op } from 'sequelize'
import logger from '../../util/logger'
import SousEquipe from './model'
import DB from '../../database/connection'
import { DATEFORMAT, now } from '../../util/util'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    codeEtablissement: string,
    codeUO: string,
    noPaging: boolean = false
  ): Promise<any> {
    let result: any
    const ordering = this.getOrdering(orderByCol, direction)
    const pagination = !noPaging ? paginate(page, pageSize) : {}

    const etablissementCriteria = codeEtablissement
      ? { where: { t_etablissement_code: codeEtablissement } }
      : {}

    const uoCriteria = codeUO ? { where: { code: codeUO } } : {}

    try {
      result = await models.SousEquipe.findAndCountAll({
        order: ordering,
        raw: false,
        nest: true,
        include: [
          {
            model: models.Departement,
            attributes: ['code', 'libelle']
          },
          {
            model: models.User,
            as: 'validateur',
            attributes: ['id', 'nom', 'prenom']
          },
          {
            model: models.UO,
            attributes: ['code', 'libelle', 'libelle_min'],
            ...etablissementCriteria,
            ...uoCriteria
          }
        ],

        ...pagination
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
    direction: string = 'ASC',
    codeEtablissement: string,
    codeUO: string,
    noPaging: boolean = false
  ): Promise<any> {
    const ordering = this.getOrdering(orderByCol, direction)
    const pagination = !noPaging ? paginate(page, pageSize) : {}
    const criteria = codeEtablissement
      ? { where: { t_etablissement_code: codeEtablissement } }
      : {}

    const resultFiltered = await models.SousEquipe.findAndCountAll({
      where: {
        [Op.and]: Sequelize.literal(
          `(t_equipe.nom||t_equipe.num_equipe||t_equipe.spot_equipe||t_equipe.date_end ||t_equipe.search||
            t_uo.code||t_uo.libelle||t_uo.libelle_min||t_departement.code||t_departement.libelle) like '%${keyword.toLowerCase()}%' `
        )
      },
      order: ordering,
      raw: false,
      nest: true,
      include: [
        {
          model: models.Departement,
          attributes: ['code', 'libelle']
        },
        {
          model: models.User,
          as: 'validateur',
          attributes: ['id', 'nom', 'prenom']
        },
        {
          model: models.UO,
          attributes: ['code', 'libelle', 'libelle_min'],
          ...criteria
        }
      ],

      ...pagination
    })

    const countUnFiltered = await models.SousEquipe.count({
      order: ordering,
      raw: false,
      nest: true,
      include: [
        {
          model: models.Departement,
          attributes: ['code', 'libelle']
        },
        {
          model: models.UO,
          attributes: ['code', 'libelle'],
          ...criteria
        },
        {
          model: models.User,
          as: 'validateur',
          attributes: ['id', 'nom', 'prenom']
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
    if (orderByCol === 'departement') {
      ordering.push([models.Departement, 'libelle', direction])
    } else if (orderByCol === 'uo') {
      ordering.push([models.UO, 'libelle', direction])
    } else if (orderByCol === 'validateur') {
      ordering.push(['validateur', 'nom', direction])
    } else {
      ordering.push([orderByCol, direction])
    }
    return ordering
  }

  static async update(sousEquipe: any) {
    return SousEquipe.update(sousEquipe, { where: { id: sousEquipe.id } })
  }

  static async save(sousEquipe: any) {
    return SousEquipe.create(sousEquipe)
  }

  static async findOneById(id: number) {
    return SousEquipe.findOne({ where: { id } })
  }

  static async findAllByUo(uoCodes: any[]) {
    const today = now(DATEFORMAT)

    return SousEquipe.findAll({
      where: {
        t_uo_code: {
          [Op.in]: uoCodes
        },
        date_end: {
          [Op.gte]: today
        }
      },
      order: [
        ['num_equipe', 'ASC'],
        ['nom', 'ASC']
      ]
    })
  }

  static async getEquipeRgType(equipeId: number) {
    let result
    const request = `select rg_type from t_rg_data 
                      inner join t_rg on t_rg_data.t_rg_code = t_rg.code
                      inner join t_departement on t_rg.code = t_departement.t_rg_code
                      inner join t_equipe on t_equipe.t_departement_code = t_departement.code
                      where t_equipe.id = ${equipeId}`

    try {
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
