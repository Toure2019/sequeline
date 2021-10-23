/* eslint-disable @typescript-eslint/camelcase */
import { Sequelize, Op, QueryTypes } from 'sequelize'
import sequelize from '../../database/connection'

import json from '../../types/json'
import models from '../index'
import paginate from '../../util/database'
import CodeRessource from '../codeRessource/model'
import Etablissement from '../etablissement/models/etablissement'
import { DATEFORMAT, now } from '../../util/util'
import moment from 'moment-timezone'
import { UserInterface } from './interfaces/user'

class Repository {
  static updateUser(user: UserInterface) {
    return models.User.update(
      user,
      {
        where: {
          id: user.userId
        }
      }
    )
  }

  static async updateUoValidationSecondaire(userId: number) {
    await models.UserProperties.findOne({
      where: {
        t_user_id: userId
      },
      order: 'date_effet DESC',
      limit: 1
    })
  }

  static async findAllRoles() {
    return models.Role.findAll({
      attributes: ['id', 'libelle'],
      raw: true,
      where: {
        id: { [Op.notIn]: [2, 3, 4, 8, 10] }
      }
    })
  }

  static async findRoleById(id: number) {
    return models.Role.findOne({
      attributes: ['id', 'libelle'],
      where: { id },
      raw: true
    })
  }

  static async findOneUserproperties(userId, dateEffet) {
    return models.UserProperties.findOne({
      where: { t_user_id: userId, date_effet: dateEffet },
      raw: true
    })
  }

  static async deleteUserproperties(userId, dateEffet) {
    return models.UserProperties.destroy({
      where: { t_user_id: userId, date_effet: dateEffet }
    })
  }

  static async findAll(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string = 't_user.login',
    direction: string = 'ASC',
    codeEtablissement: string,
    showInactive: number = 0,
    equipeId: number
  ) {
    const { offset, limit } = paginate(page, pageSize)

    const enabledEquipe = {}

    let whereEtablissementRequest = 'where 1 = 1'
    if (codeEtablissement) {
      whereEtablissementRequest = `where (t_etablissement_code = '${codeEtablissement}')`
    }

    let whereInactifRequest = 'AND t_user.enabled = \'1\''
    if (showInactive === 1) {
      whereInactifRequest = 'AND t_user.enabled = \'0\''
    }

    if (equipeId) {
      enabledEquipe['t_equipe_id'] = equipeId
    }

    const enabledSearch = keyword
      ? `AND (t_user.nom ilike '%${keyword}%' or prenom ilike '%${keyword}%' or t_equipe.nom ilike '%${keyword}%' or num_equipe ilike '%${keyword}%' or t_user.login ilike '%${keyword}%')`
      : ''
    const currentDate = moment()
      .tz('Europe/Paris')
      .format('YYYY-MM-DD')

    if (orderByCol == 'id') {
      orderByCol = 't_user.id'
    }

    const query = `select DISTINCT t_user.id, t_user.login, t_user.nom, t_user.is_superuser, t_user.prenom, t_user.mail, t_user.phone, t_user.date_create, t_user.enabled, t_user.version,
    t_user_properties.t_code_ressource_code, t_equipe.num_equipe as num_equipe, t_uo.code as uo_code, t_type_uo.t_niveau_uo_code as t_niveau_uo_code
    from t_user
    inner join t_user_properties on t_user.id = t_user_id
    inner join t_uo on t_user_properties.t_uo_code = t_uo.code
    inner join t_etablissement ON t_etablissement.code = t_uo.t_etablissement_code
    inner join t_type_uo on t_uo.t_type_uo_code = t_type_uo.code
    left join t_equipe on t_user_properties.t_equipe_id = t_equipe.id
    ${whereEtablissementRequest}
    ${whereInactifRequest}
    ${enabledSearch}
    and t_user_properties.date_effet <= '${currentDate}' and t_user_properties.date_effet_end > '${currentDate}'
    and t_uo.date_effet <= '${currentDate}' and t_uo.date_effet_end > '${currentDate}'
    and t_etablissement.date_effet <= '${currentDate}' and t_etablissement.date_effet_end > '${currentDate}'
    ORDER BY ${orderByCol} ${direction}
    LIMIT ${limit} OFFSET ${offset}`

    const resultFiltered = await sequelize.query(query, {
      type: QueryTypes.SELECT
    })

    const queryCountUnFiltered = `select count(DISTINCT t_user.id) as count
    from t_user
    inner join t_user_properties on t_user.id = t_user_id
    inner join t_uo on t_user_properties.t_uo_code = t_uo.code
    inner join t_etablissement ON t_etablissement.code = t_uo.t_etablissement_code
    inner join t_type_uo on t_uo.t_type_uo_code = t_type_uo.code
    left join t_equipe on t_user_properties.t_equipe_id = t_equipe.id
    ${whereEtablissementRequest}
    ${whereInactifRequest}
    ${enabledSearch}
    and t_user_properties.date_effet <= '${currentDate}' and t_user_properties.date_effet_end > '${currentDate}'
    and t_uo.date_effet <= '${currentDate}' and t_uo.date_effet_end > '${currentDate}'
    and t_etablissement.date_effet <= '${currentDate}' and t_etablissement.date_effet_end > '${currentDate}'`
    const countUnFiltered = await sequelize.query(queryCountUnFiltered, {
      type: QueryTypes.SELECT
    })

    const result = {
      rows: resultFiltered,
      page,
      pageSize,
      recordsTotal: countUnFiltered[0]['count'],
      recordsFiltered: countUnFiltered[0]['count']
    }

    return result
  }

  static async findUserPropertiesByIdAndDateEffet(userId, dateEffet) {
    return await models.UserProperties.findOne({
      attributes: [
        't_user_id',
        'date_effet',
        'date_effet_end',
        't_emploi_repere_code',
        't_code_ressource_code'
      ],
      include: [
        {
          attributes: ['code', 'libelle'],
          model: models.UO,
          include: [
            {
              attributes: ['code', 'libelle'],
              model: models.TypeUo,
              include: [
                {
                  attributes: ['code', 'libelle'],
                  model: models.NiveauUo
                }
              ]
            },
            {
              attributes: ['code', 'libelle'],
              model: models.Etablissement
            },
            {
              attributes: ['code', 'libelle'],
              model: models.Departement,
              include: [
                {
                  attributes: ['code', 'libelle_min'],
                  model: models.Rg,
                  include: [
                    {
                      attributes: ['code', 'libelle_min'],
                      model: models.Division
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          attributes: ['code', 'libelle_min'],
          model: models.EmploiRepere
        }
      ],
      where: {
        t_user_id: userId,
        date_effet: dateEffet
      },
      raw: true
    })
  }

  static async findRecentUserProperties(userId: number) {
    const result: any[] = await models.UserProperties.findAll({
      where: {
        t_user_id: userId
      },
      order: ['date_effet'],
      raw: true
    })

    return result.pop()
  }

  static async findAllUserRolesAccessibles(userId: number) {
    const userRoles = await models.UserRole.findAll({
      where: {
        t_user_id: userId
      },
      include: [
        {
          model: models.Role,
        },
      ],
      order: [['t_role_id', 'ASC']],
    })
    
    const roles = []
    for (let i = 0; i < userRoles.length; i += 1) {
      const element = {}

      element['id'] = userRoles[i].t_role.id
      element['libelle'] = userRoles[i].t_role.libelle
      roles.push(element)
    }

    return roles
  }

  static async findAllByEquipe(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    equipeId: any,
    noPaging: boolean = false
  ) {
    const currentDate = now(DATEFORMAT)
    const pagination = !noPaging ? paginate(page, pageSize) : {}

    const ordering = this.getOrdering(orderByCol, direction)
    const result: any = await models.User.findAndCountAll({
      order: ordering,
      include: [
        {
          model: models.UserProperties,
          where: {
            date_effet: {
              [Op.lte]: currentDate
            },
            date_effet_end: {
              [Op.gt]: currentDate
            },
            t_equipe_id: equipeId
          },
          attributes: ['date_effet', 't_equipe_id'],
          required: true
        }
      ],
      raw: false,
      nest: true,
      ...pagination
    })
    result.rows = this.adaptresult(result.rows)
    return {
      ...result,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static async findAllByListEquipe(codesEquipe: any, userId) {
    const currentDate = now(DATEFORMAT)

    return await models.User.findAll({
      include: [
        {
          model: models.UserRole,
          include: [
            {
              model: models.Role,
            },
          ]
        },
        {
          model: models.UserProperties,
          where: {
            date_effet: {
              [Op.lte]: currentDate
            },
            date_effet_end: {
              [Op.gt]: currentDate
            },
            t_equipe_id: {
              [Op.in]: codesEquipe
            }
          },
          include: [
            {
              model: models.CodeRessource,
            },
            {
              model: models.SousEquipe,
            },
            {
              model: models.UO,
              attributes: [
                'code',
              ],
              include: [
                {
                  model: models.TypeUo,
                  attributes: [
                    'code'
                  ],
                  include: [
                    {
                      model: models.NiveauUo
                    }
                  ]
                }
              ]
            }
          ],
          attributes: ['date_effet'],
          required: true
        }
      ],
      where: {
        id: {
          [Op.not]: userId,
        }
      }
    })
  }

  static async findAllCodeRessource(codeEtablissement: string) {
    const etablissement = await Etablissement.findOne({
      attributes: ['t_type_etablissement_code'],
      where: {
        code: codeEtablissement
      },
      raw: true
    })
    return await CodeRessource.findAll({
      where: {
        t_type_etablissement_code: etablissement.t_type_etablissement_code
      },
      raw: true
    })
  }

  static async selectSearch(
    listEquipeId: number[],
    codeEtablissement: string
  ): Promise<any> {
    let result
    const currentDate = now(DATEFORMAT)
    try {
      result = await models.User.findAll({
        attributes: [
          'id',
          'login',
          'nom',
          'prenom',
          [Sequelize.col('t_user_properties.t_equipe_id'), 't_equipe_id'],
          [Sequelize.col('t_user_properties.t_equipe.num_equipe'), 'num_equipe']
        ],
        raw: true,
        include: [
          {
            model: models.UserProperties,
            attributes: [],
            where: {
              date_effet: {
                [Op.lte]: currentDate
              },
              date_effet_end: {
                [Op.gt]: currentDate
              },
              t_equipe_id: {
                [Op.ne]: listEquipeId
              }
            },
            required: true,
            include: [
              {
                model: models.SousEquipe,
                attributes: []
              },
              {
                model: models.UO,
                attributes: [],
                where: {
                  t_etablissement_code: codeEtablissement
                }
              }
            ]
          }
        ]
      })
    } catch (err) {
      return err
    }
    return result
  }

  static getOrdering(orderByCol, direction) {
    const ordering = []
    if (orderByCol === 'uo') {
      ordering.push(['t_user_properties', 't_uo', 'libelle', direction])
    } else if (orderByCol === 'sous-equipe') {
      ordering.push([models.SousEquipe, 'nom', direction])
    } else if (orderByCol === 'niveau') {
      ordering.push([
        't_user_properties',
        't_uo',
        't_type_uo',
        't_niveau_uo',
        'code',
        direction
      ])
    } else {
      ordering.push([orderByCol, direction])
    }
    return ordering
  }

  static async removeAllRolesFromUserId(userId: number) {
    return models.UserRole.destroy({
      where: {
        t_user_id: userId
      }
    })
  }

  static async addRoles(data: json) {
    return models.UserRole.bulkCreate(data)
  }

  static async findOneUserById(id: number) {
    const user = await models.User.findOne({ where: { id } })
    return user
  }

  static async findAllUsersById(usersId: number[]) {
    return await models.User.findAll({
      where: {
        id: { [Op.in]: usersId }
      },
      raw: true
    })
  }

  static async getUserProperties(userId: number) {
    const current = now(DATEFORMAT)
    return models.UserProperties.findOne({
      where: {
        t_user_id: userId,
        date_effet: {
          [Op.lte]: current
        },
        date_effet_end: {
          [Op.gt]: current
        },
      },
      order: [['date_effet', 'DESC']],
      raw: true
    })
  }

  static async getAllUserProperties(userIds: number[]) {
    const current = now(DATEFORMAT)
    return await models.UserProperties.findAll({
      where: {
        t_user_id: {
          [Op.in]: userIds
        },
        date_effet: {
          [Op.lte]: current
        },
        date_effet_end: {
          [Op.gt]: current
        },
      },
      order: [['date_effet', 'DESC']],
      raw: true
    })
  }

  static async updateUserProperties(currentProperties: json, data: json) {
    // End current properties
    const current = moment()
      .tz('Europe/Paris')
      .format('YYYY-MM-DD')

    if (currentProperties) {
      if (currentProperties.date_effet == current) {
        return await models.UserProperties.update(data, {
          where: {
            date_effet: currentProperties.date_effet,
            t_user_id: currentProperties.t_user_id
          }
        })
      } else {
        const old = currentProperties
        old.date_effet_end = current
        old.version = current

        await models.UserProperties.update(
          {
            date_effet_end: current,
            version: current
          },
          {
            where: {
              date_effet: currentProperties.date_effet,
              t_user_id: currentProperties.t_user_id
            }
          }
        )

        const newProperty = currentProperties
        newProperty.date_effet = current
        newProperty.date_effet_end = moment('2150-01-01')
          .tz('Europe/Paris')
          .format('YYYY-MM-DD')
        newProperty.t_uo = data.t_uo
        newProperty.t_equipe_id = data.t_equipe_id
        newProperty.t_code_ressource_code = data.t_code_ressource_code
        newProperty.uo_validation_secondaire = data.uo_validation_secondaire

        // Save the new property
        return await models.UserProperties.create(newProperty)
      }
    }
  }

  static adaptresult(rows: any) {
    return rows.map(item => {
      item = item.toJSON()
      item.t_user_properties.forEach(element => {
        if (
          element.t_uo &&
          element.t_uo.t_type_uo &&
          element.t_uo.t_type_uo.t_niveau_uo
        ) {
          element.t_uo.t_niveau_uo = element.t_uo.t_type_uo.t_niveau_uo
          delete element.t_uo.t_type_uo
          return element
        } else {
          return element
        }
      })

      return item
    })
  }

  static async getUserById(userId: string, raw?: boolean) {
    const result = await models.User.findOne({
      where: { id: userId },
      include: [
        {
          model: models.UO,
          attributes: ['code', 'libelle']
        },
        {
          model: models.UserRole
        },
        {
          model: models.UserProperties,
          required: false,
          include: [
            {
              attributes: ['id', 'num_equipe', 'nom'],
              model: models.SousEquipe
            },
            {
              model: models.UO,
              include: [
                { model: models.TypeUo, include: [{ model: models.NiveauUo }] }
              ]
            }
          ]
        }
      ],
      raw: raw,
      nest: true
    })

    return result
  }

  static async findUserById(userId: string) {
    return models.User.findOne({
      attributes: [
        'id',
        'login',
        'nom',
        'prenom',
        'mail',
        'phone',
        'is_superuser',
        'enabled',
        't_uo_code_assistant'
      ],
      where: { id: userId },
      nest: true,
      raw: true
    })
  }

  static async getUserLoginById(userId: string) {
    const result = await models.User.findOne({
      attributes: ['login'],
      where: { id: userId },
      raw: true
    })

    return result.login
  }
}

export default Repository
