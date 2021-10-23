/* eslint-disable @typescript-eslint/camelcase */
import { QueryTypes } from 'sequelize'
import DB from '../../../database/connection'

import models from '../../index'
import logger from '../../../util/logger'
import { DATEFORMAT, now } from '../../../util/util'

class Repository {
  static getUserRole = async (userId: number) => {
    let role = 0

    // Get user role
    const res = await models.UserRole.findOne({
      where: {
        t_user_id: userId
      },
      raw: true
    })

    if (res) {
      role = res.t_role_id
    }

    return role
  }

  static getCompteByBupcProjetActivite = async (
    codeEtablissement: number,
    pc: string,
    projet: string,
    activite: string
  ) => {
    const currentDate = now(DATEFORMAT)

    const andRequestDate = `and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}' `
    const andRequest = `and t_etablissement_code = '${codeEtablissement}' `

    const request = `select * from t_compte where pc = '${pc}' 
    and projet = '${projet}' 
    and activite = '${activite}' 
    ${andRequestDate} ${andRequest}`

    return DB.query(request, {
      type: QueryTypes.SELECT,
      raw: true
    })
  }

  static getCptIntermediaire = async (
    id: number,
    codeEtablissement: number,
    pc: string,
    projet: string,
    activite: string
  ) => {
    let response = ''

    if (id != 1) {
      return response
    }

    const compte = await Repository.getCompteByBupcProjetActivite(
      codeEtablissement,
      pc,
      projet,
      activite
    )

    const cleanCompte = compte.filter((x: any) => x.sous_categorie != '')

    response = cleanCompte.join('|')

    return response
  }

  static getFiltreValue = async (compteId: number, filtreId: number) => {
    const filtreCompte = await models.FiltreCompte.findAll({
      where: {
        t_compte_id: compteId
      },
      raw: true
    })

    let response = ''
    for (let index = 0; index < filtreCompte.length; index++) {
      const element = filtreCompte[index]
      if (element.t_filtre_compte_id == filtreId) {
        response = element.value
        break
      }
    }

    return response
  }

  static getSpecialite = (id: number) => {
    // TODO: Put this in a config file
    const config = [
      {
        id: 1,
        name: 'VOIE',
        visible: true
      },
      {
        id: 2,
        name: 'SE',
        visible: true
      },
      {
        id: 3,
        name: 'CAT',
        visible: true
      },
      {
        id: 4,
        name: 'SM',
        visible: true
      },
      {
        id: 5,
        name: 'ALL',
        visible: true
      },
      {
        id: 6,
        name: 'SE - SM',
        visible: true
      },
      {
        id: 7,
        name: 'TELECOM',
        visible: true
      },
      {
        id: 8,
        name: 'OA/OT',
        visible: true
      },
      {
        id: 9,
        name: 'EALE',
        visible: true
      },
      {
        id: 10,
        name: 'MOET',
        visible: true
      },
      {
        id: 11,
        name: 'NPM',
        visible: true
      },
      {
        id: 12,
        name: 'CIRCULATION',
        visible: true
      },
      {
        id: 13,
        name: 'INFORMATIQUE',
        visible: true
      }
    ]

    let response = ''
    for (let index = 0; index < config.length; index++) {
      if (id == config[index].id) {
        response = config[index].name
        break
      }
    }

    return response
  }

  static getTypeCompteName = (id: number) => {
    // TODO: Put this in a config file
    const config = [
      {
        id: 1,
        name: 'Travaux'
      },
      {
        id: 2,
        name: 'Maintenance'
      },
      {
        id: 3,
        name: 'Non Productif',
        other_names: 'tna'
      },
      {
        id: 4,
        name: 'Sinistre'
      },
      {
        id: 5,
        name: 'Projet'
      },
      {
        id: 6,
        name: 'Prestation URA'
      },
      {
        id: 7,
        name: 'Prestation diverse'
      },
      {
        id: 8,
        name: 'Entretien des engins'
      },
      {
        id: 9,
        name: 'OGE'
      },
      {
        id: 10,
        name: 'Tiers'
      }
    ]

    let response = ''
    for (let index = 0; index < config.length; index++) {
      if (id == config[index].id) {
        response = config[index].name
        break
      }
    }

    return response
  }

  static getRgsCodeOfCurrentEtablissement = async (
    codeEtablissement: number
  ) => {
    const currentDate = now(DATEFORMAT)

    const andRequestDate = `and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}' `
    const andRequestDate1 = `and t_uo.date_effet <= '${currentDate}' and t_uo.date_effet_end > '${currentDate}' `
    const andRequestDate2 = `and t_departement.date_effet <= '${currentDate}' and t_departement.date_effet_end > '${currentDate}' `

    const request = `select code from t_rg where code in 
      (select t_rg_code 
      from t_uo inner join t_departement on t_departement_code = t_departement.code 
      where t_etablissement_code = '${codeEtablissement}' ${andRequestDate1} ${andRequestDate2}) 
      ${andRequestDate}`

    const results = await DB.query(request, {
      type: QueryTypes.SELECT,
      raw: true
    })

    if (results.length == 0) {
      return '(\'-1\')'
    }

    // put them all like this (11, 55, 77)
    const data = results.map((x: Record<string, any>) => x.code)

    return `(${data.join()})`
  }

  static getUserRgCode = async (userId: number) => {
    let departementCode = ''
    const userDept = await models.UserProperties.findOne({
      attributes: ['t_departement_code'],
      where: {
        t_user_id: userId
      },
      raw: true
    })

    if (!userDept) {
      const error = new Error(
        `L'utilisateur avec cet id "${userId}" ne possède pas de user properties (ce qui permet de récupérer un RG grâce a son département)`
      )
      return error
    }

    departementCode = userDept.t_departement_code

    const departement = await models.Departement.findOne({
      where: {
        code: departementCode
      },
      raw: true
    })

    if (!departement) {
      const error = new Error(
        `L'utilisateur avec cet id "${userId}" possède un code département "${departementCode}" introuvable dans la table t_departement`
      )
      return error
    }
    return departement.t_rg_code
  }

  static getRgRequestForCurrentRole = async (
    userId: number,
    roleId: number,
    codeEtablissement: number,
    dateFilter: string
  ) => {
    let rgRequest = 'and (from_erp = \'0\' '

    if (roleId == 1) {
      //super admin
      rgRequest += 'OR from_erp = \'1\' '
    } else if (roleId == 2 || roleId == 3) {
      // admin or cgie

      const getRgsCodeOfCurrentEtablissement = await Repository.getRgsCodeOfCurrentEtablissement(
        codeEtablissement
      )

      rgRequest += `OR (pc, projet, activite) in (select bupc, projet, activite from t_compte_accessible where t_rg_code in ${getRgsCodeOfCurrentEtablissement} ${dateFilter}) `
    } else {
      const getUserRgCode = await Repository.getUserRgCode(userId)

      if (getUserRgCode instanceof Error) {
        return getUserRgCode
      }
      rgRequest += `OR (pc, projet, activite) in (select bupc, projet, activite from t_compte_accessible where t_rg_code = '${getUserRgCode}' ${dateFilter}) `
    }

    rgRequest += ') '

    return rgRequest
  }

  static getAllComptes = async (
    userId: number,
    codeEtablissement: number,
    index: number = 0,
    limit: number = 10000
  ) => {
    const currentDate = now(DATEFORMAT)

    const dateFilter = `and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}' `
    const roleId = await Repository.getUserRole(userId)

    const rgRequest = await Repository.getRgRequestForCurrentRole(
      userId,
      roleId,
      codeEtablissement,
      dateFilter
    )

    if (rgRequest instanceof Error) {
      return rgRequest
    }

    const andRequest = `and t_etablissement_code = '${codeEtablissement}' `
    const order = 'order by nom, id '
    const requestOffset = `OFFSET ${index} ROWS FETCH NEXT ${limit} ROWS ONLY`
    const request = `select * from t_compte where visible = '1' ${rgRequest} ${dateFilter} ${andRequest} ${order} ${requestOffset};`

    logger.info(
      `Exportation - Compte - requète de récupération des comptes: ${request}`
    )

    return DB.query(request, { type: QueryTypes.SELECT, raw: true })
  }
}

export default Repository
