/* eslint-disable @typescript-eslint/camelcase */
import Repository from '../repository'
import UserSchema from '../userSchema'
import json from '../../../types/json'
import models from './../../index'
import DB from '../../../database/connection'
import { Op, QueryTypes } from 'sequelize'
import RoleService from './role'
import { get422Error, DATEFORMAT, now } from '../../../util/util'
import logger from '../../../util/logger'
import { UserInterface } from '../interfaces/user'

interface UserProperties {
  nom: string,
  debut: number,
  fin: string,
  departement: string,
  uo: string,
  niveau: string,
  codeRessource: string,
  sousEquipe: string,
  affectation: string,
  cessation: string,
}
class Service {
  static validateRequest(data: any) {
    const response = UserSchema.validate(data)
    const result: UserInterface = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static findAll(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement,
    onlyActive: number,
    equipeId: number
  ): Promise<any> {
    return Repository.findAll(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement,
      onlyActive,
      equipeId
    )
  }

  static findAllbyEquipe(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    equipeId: number
  ): Promise<any> {
    return Repository.findAllByEquipe(
      page,
      pageSize,
      orderByCol,
      direction,
      equipeId
    )
  }

  static findAllByListEquipe(codesEquipe, userId) {
    return Repository.findAllByListEquipe(codesEquipe, userId)
  }

  static findAllCodeRessources(codeEtablissement: string): Promise<any> {
    return Repository.findAllCodeRessource(codeEtablissement)
  }

  static selectSearch(
    listEquipeId: number[],
    codeEtablissement: string
  ): Promise<any> {
    return Repository.selectSearch(listEquipeId, codeEtablissement)
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string,
    onlyActive: number,
    codeEquipe: number
  ) {
    return this.findAll(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement,
      onlyActive,
      codeEquipe
    )
  }

  static async findAllUserProperties(
    userId: string
  ) {
    const queryResult = await models.UserProperties.findAll({
      attributes: [
        't_user_id',
        'date_effet',
        'date_effet_end',
        't_emploi_repere_code',
        't_code_ressource_code',
        'date_affectation',
        'date_cessation_activite',
        't_departement_code'
      ],
      include: [
        {
          attributes: ['code', 'libelle', 't_departement_code', 't_etablissement_code'],
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
            }
          ]
        },
        {
          attributes: ['code', 'libelle_min'],
          model: models.EmploiRepere
        },
        {
          attributes: ['nom'],
          model: models.SousEquipe
        },
        {
          attributes: ['nom', 'prenom'],
          model: models.User
        },
      ],
      where: {
        t_user_id: userId
      },
      raw: true,
      nest: true,
    })

    const result: UserProperties[] =  await Promise.all(queryResult.map(async element => {
      const codeRessource = await Service.getUserCodeRessource(
        element.t_emploi_repere_code, element.t_code_ressource_code, element.t_uo?.t_etablissement_code
      )
      return {
        nom : `${element?.t_user?.nom} ${element?.t_user?.prenom}`,
        debut: element.date_effet,
        fin: element.date_effet_end,
        departement: element.t_departement_code ? element.t_departement_code : element.t_uo?.t_departement_code,
        uo: element.t_uo?.code,
        niveau: element.t_uo?.t_type_uo?.t_niveau_uo?.code,
        codeRessource: codeRessource,
        sousEquipe: element.t_equipe?.nom,
        affectation: element.date_affectation ? element.date_affectation : '2020-01-01',
        cessation: element.date_cessation_activite
      }
    }))

    return result
  }

  static async getUserById(userId: string, raw: boolean = false) {
    return await Repository.getUserById(userId, raw)
  }

  static async getUserLoginById(userId: string) {
    return await Repository.getUserLoginById(userId)
  }

  static findUserById(userId: string) {
    return Repository.findUserById(userId)
  }

  static async getRecentUserProperties(userId: string) {
    return await models.UserProperties.findAll({
      attributes: [
        't_user_id',
        'date_effet',
        'date_effet_end',
        't_emploi_repere_code',
        't_code_ressource_code',
        't_equipe_id'
      ],
      where: { t_user_id: userId },
      order: [['version', 'DESC']],
      limit: 1,
      raw: true,

      include: [
        {
          attributes: ['code', 'libelle', 't_uo_code_parent'],
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
        },
        {
          attributes: ['id', 'num_equipe', 'nom'],
          model: models.SousEquipe
        }
      ]
    }).then(res => res.shift())
  }

  static async getUserProperties(userId: string, date: string) {
    return await models.UserProperties.findAll({
      attributes: [
        't_user_id',
        'date_effet',
        'date_effet_end',
        't_emploi_repere_code',
        't_code_ressource_code',
        't_equipe_id'
      ],
      where: {
        t_user_id: userId,
        date_effet: { [Op.lte]: date },
        date_effet_end: { [Op.gt]: date }
      },
      order: [['date_effet', 'DESC']],
      raw: true,

      include: [
        {
          attributes: ['code', 'libelle', 't_uo_code_parent'],
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
        },
        {
          attributes: ['id', 'num_equipe', 'nom'],
          model: models.SousEquipe
        }
      ]
    })
  }

  static async getUserCodeRessource(
    emploisRepereCode: string, codeRessourceCode: string, etablissementCode: string
  ) {
    let codeRessource

    if (emploisRepereCode) {
      const emploiRepereCodeRessource = await models.EmploiRepereCodeRessource.findOne(
        {
          attributes: ['t_code_ressource_code'],
          where: {
            t_emploi_repere_code: emploisRepereCode
          },
          raw: true
        }
      )

      codeRessource = emploiRepereCodeRessource?.t_code_ressource_code
    } else {
      if (codeRessourceCode) {
        // Same thing of the previous deleted code
        codeRessource = codeRessourceCode
      } else {
        const emploisRepere = await models.EmploiRepereCodeRessource.findAll({
          where: {
            t_type_etablissement_code:
            etablissementCode,
            t_emploi_repere_code: emploisRepereCode
          },
          raw: true,
          limit: 1
        })

        codeRessource = emploisRepere.t_code_ressource_code
      }
    }

    return codeRessource
  }

  /**
   * GET /
   * returns user superviseur
   */
  static async getUserSuperviseur(equipeId, uoId, uoParentId) {
    let superviseur = null

    const currentDate = now(DATEFORMAT)

    const uoSuperviseurQuery = `select * from t_user where enabled = '1' and flag_type_validation in ('1','3') and id in (select t_user_id from t_user_properties where t_uo_code = '${uoId}' and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}') limit 1`

    superviseur = await DB.query(uoSuperviseurQuery, {
      type: QueryTypes.SELECT,
      raw: true
    })[0]

    let superviseurEquipe = null

    if (superviseur != null) {
      const uoSuperviseurEquipeQuery = `select t_equipe_id from t_user_properties where t_user_id = ${superviseur.id} and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}'`
      superviseurEquipe = await DB.query(uoSuperviseurEquipeQuery, {
        type: QueryTypes.SELECT,
        raw: true
      })[0]

      if (superviseurEquipe != equipeId) {
        return superviseur
      }
    }

    if (superviseur == null || superviseurEquipe == equipeId) {
      const uoParentSuperviseurQuery = `select * from t_user where enabled = '1' and flag_type_validation in ('1','3') and id in (select t_user_id from t_user_properties where t_uo_code = '${uoParentId}' and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}') limit 1`

      superviseur = await DB.query(uoParentSuperviseurQuery, {
        type: QueryTypes.SELECT,
        raw: true
      })[0]
    }

    return superviseur
  }

  static async findOneUserById(id: number) {
    const result = await Repository.findOneUserById(id)
      .then(res => res)
      .catch((err: Error) => err)
    let error: json = {}

    if (result instanceof Error) {
      error = {
        type: 'internalServerError',
        message: 'Erreur de connexion à la base de donnée',
        userMessage:
          'Une erreur a été détectée lors de la récupération des informations en base de données, veuillez réessayer plus tard.',
        error: result
      }
    }

    if (!result) {
      error = {
        type: 'notFound',
        message: 'Ressource non existante',
        userMessage: `Aucun utilisateur n'a été trouvé dans la base de données avec l'id: ${id}.`,
        error: {},
        noResult: true
      }
    }

    return { result, error }
  }

  static async findOneUserproperties(userid: number, dateEffet: string) {
    const result = await Repository.findOneUserproperties(userid, dateEffet)
    let error: json = null

    if (result instanceof Error) {
      error = {
        type: 'internalServerError',
        message: 'Erreur de connexion à la base de donnée',
        userMessage:
          'Une erreur a été détectée lors de la récupération des informations en base de données, veuillez réessayer plus tard.',
        error: result
      }
    }

    if (!result) {
      error = {
        type: 'notFound',
        message: 'Ressource non existante',
        userMessage: `Aucun utilisateur properties n'a été trouvé dans la base de données avec le user id: ${userid} et la date ${dateEffet}.`,
        error: {},
        noResult: true
      }
    }

    return { result, error }
  }

  static async getAllUsersProperties(userIds: number[]) {
    return await Repository.getAllUserProperties(userIds)
  }

  static async getLastUserProperties(userId) {
    return await Repository.getUserProperties(userId)
  }

  static async deleteUserproperties(userid: number, dateEffet: string) {
    return await Repository.deleteUserproperties(userid, dateEffet)
  }

  static async getUserRoles(user) {
    const userRolesAccessibles = await RoleService.findAllUserRolesAccessibles(user.id)

    if (userRolesAccessibles.length  <= 0) {
      logger.warning('No roles linked to user', user)
    }

    return userRolesAccessibles
  }

  static getRoleParNiveau(niveau: number) {
    switch (niveau) {
      case 8: {
        //NIVEAU_UO_DET
        return 10 //ROLE_DET
      }
      case 9: {
        //NIVEAU_UO_DU
        return 2 //ROLE_DUO
      }
      case 10: {
        //NIVEAU_UO_DPX
        return 3 //ROLE_DPX
      }
      case 11: {
        //NIVEAU_UO_AGENT
        return 6 //ROLE_AGENT
      }
      default: {
        return 6 //ROLE_AGENT
      }
    }
  }

  static async getNiveauUOValideur(userId: string, userProperties: any) {
    if (userProperties) {
      return userProperties['t_uo.t_type_uo.t_niveau_uo.code']
    }
  }

  static async getNiveauUOAssistant(user, userProperties: any) {
    let uoManage = null
    if (userProperties) {
      uoManage = userProperties['t_uo.code']

      if (user.t_uo_code_assistant) {
        uoManage = user.t_uo_code_assistant
      }
    }

    return uoManage
  }

  static async findAllUsersById(usersId: number[]) {
    return await Repository.findAllUsersById(usersId)
  }

  static updateUser(user: UserInterface) {
    return Repository.updateUser(user)
  }
}

export default Service
