/* eslint-disable @typescript-eslint/camelcase */
import User from './model'
import UserProperties from './../user/models/userProperties'
import models from '..'
import paginate from '../../util/database'
import { Sequelize, Op } from 'sequelize'

class Repository {
  static async findByLogin(login: string) {
    const user = await User.findOne({
      where: { login },
      raw: true
    })

    if (user) {
      await UserProperties.findAll({
        attributes: [],
        where: { t_user_id: user['id'] },
        order: [['version', 'DESC']],
        limit: 1,
        raw: true,

        include: [
          {
            attributes: ['code', 'libelle'],
            model: models.UO,
            include: [
              {
                attributes: ['code', 'libelle', 'libelle_min'],
                model: models.Etablissement
              }
            ]
          },
          {
            attributes: ['id', 'num_equipe'],
            model: models.SousEquipe,
          }
        ]
      }).then(res => {
        if (res.length > 0) {
          const userProperties = res.shift()
          if (userProperties) {
            user['etablissement'] = {
              code: userProperties['t_uo.t_etablissement.code'],
              libelle: userProperties['t_uo.t_etablissement.libelle'],
              libelle_min: userProperties['t_uo.t_etablissement.libelle_min'],
            }
            user['uo'] = {
              code: userProperties['t_uo.code'],
              libelle: userProperties['t_uo.libelle']
            }
            user['sousEquipe'] = {
              id: userProperties['t_equipe.id'],
              libelle: userProperties['t_equipe.num_equipe'],
            }
          }
        }
      })
    }

    return user
  }

  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC'
  ) {
    const result: any = await models.User.findAndCountAll({
      order: [[orderByCol, direction]],
      include: [
        {
          model: models.UO,
          attributes: ['code', 'libelle'],
          required: false
        },
        {
          model: models.SousEquipe,
          attributes: ['id', 'nom'],
          required: false
        }
      ],
      raw: false,
      nest: true,
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
    orderByCol: string = 'id',
    direction: string = 'ASC'
  ): Promise<any> {
    let filteredResult: any
    let unfilteredResultCount: number
    try {
      filteredResult = await models.User.findAndCountAll({
        where: {
          [Op.and]: Sequelize.literal(
            `(t_user.nom||t_user.prenom) like '%${keyword}%' `
          )
        },
        order: [[orderByCol, direction]],
        raw: false,
        nest: true,
        include: [
          {
            model: models.UO,
            attributes: ['code', 'libelle'],
            required: false,
            include: [
              {
                model: models.TypeUo,
                attributes: ['code', 'libelle'],
                include: [{ model: models.NiveauUo }]
              }
            ]
          },
          {
            model: models.SousEquipe,
            attributes: ['id', 'nom'],
            required: false
          }
        ],
        ...paginate(page, pageSize)
      })
      unfilteredResultCount = await models.User.count({
        where: {
          enabled: 1
        },
        order: [[orderByCol, direction]],
        raw: false,
        nest: true
      })
    } catch (err) {}
    return {
      rows: filteredResult.rows,
      page,
      pageSize,
      recordsTotal: unfilteredResultCount,
      recordsFiltered: filteredResult.count
    }
  }

  static async update(user: any) {
    return User.update(user, { where: { id: user.id } })
  }

  static async findOneById(id: string) {
    return User.findOne({ where: { id } })
  }
}

export default Repository
