/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import Compte from './model/compte'
import { Sequelize } from 'sequelize'
import { Op } from 'sequelize'
import DB from '../../database/connection'
import { QueryTypes } from 'sequelize'
import logger from '../../util/logger'
import typeCompteConfig from './referentielType'
import moment from 'moment'
import { DATEFORMAT, now } from '../../util/util'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    showInactif: boolean,
    codeEtablissement: string,
    noProductif: string,
    noPaging: boolean = false
  ): Promise<any> {
    let result: any
    const pagination = !noPaging ? paginate(page, pageSize) : {}
    const ordering = this.getOrdering(orderByCol, direction)
    const etabCriteria = codeEtablissement
      ? { t_etablissement_code: codeEtablissement }
      : {}

    let boolNoProductif
    try {
      if (noProductif !== undefined) {
        boolNoProductif = JSON.parse(noProductif)
      }
    } catch (err) {
      console.error(err)
    }

    const noProductifCriteria = noProductif !== undefined
      ? { no_productif: boolNoProductif === true ? 1 : 0 }
      : {}

    const enabledCriteria = showInactif
      ? { ...etabCriteria, ...noProductifCriteria }
      : { visible: 1, ...etabCriteria, ...noProductifCriteria }

    try {
      result = await models.Compte.findAndCountAll({
        where: {
        ...enabledCriteria,
        },
        order: ordering,
        raw: false,
        nest: true,
        distinct: true,
        include: [
          {
            model: models.FiltreCompte,
            attributes: ['t_filtre_compte_id', 'value']
          },
          {
            model: models.TypeCompte,
            attributes: ['id', 'name']
          },
          {
            model: models.Specialite,
            attributes: ['id', 'name']
          },
        ],
        ...pagination
      })
    } catch (err) {
      logger.debug(err.message)
    }
    return {
      rows: result.rows,
      count: result.rows.length,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static getOrdering(orderByCol, direction) {
    let ordering = [[orderByCol, direction], [models.FiltreCompte,'t_filtre_compte_id','ASC']]
    if (orderByCol === 't_type_compte') {
      ordering = [[models.TypeCompte, 'name', direction]]
    } else if (orderByCol === 't_specialite_id') {
      ordering = [[models.Specialite, 'name', direction]]
    }
    return ordering
  }

  static async search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    showInactif: boolean,
    codeEtablissement: string
  ): Promise<any> {
    let resultFiltered: any
    let unfilteredCount: number
    const ordering = this.getOrdering(orderByCol, direction)
    const showInactiveCriteria = showInactif
      ? { t_etablissement_code: codeEtablissement }
      : { visible: 1, t_etablissement_code: codeEtablissement }

    try {
      resultFiltered = await models.Compte.findAndCountAll({
        where: {
          ...showInactiveCriteria,
          [Op.and]: Sequelize.literal(`(t_compte.nom||t_compte.designation) like '%${keyword}%'`),
        },
        order: ordering,
        raw: false,
        nest: true,
        include: [
          {
            model: models.FiltreCompte,
            attributes: ['t_filtre_compte_id', 'value'],
          },
          {
            model: models.TypeCompte,
            attributes: ['id', 'name']
          },
          {
            model: models.Specialite,
            attributes: ['id', 'name']
          },
        ],
        ...paginate(page, pageSize)
      })

      unfilteredCount = await models.Compte.count({
        where: {
          ...showInactiveCriteria,
        },
        order: [[orderByCol, direction]],
        raw: false,
        nest: true,
      })
    } catch (err) {
      logger.debug(err.message)
    }

    const formattedResult = {
      rows: resultFiltered.rows,
      page,
      pageSize,
      recordsTotal: unfilteredCount,
      recordsFiltered: resultFiltered.count
    }
    return formattedResult
  }

  static async update(compte: any) {
    const id = compte.id
    delete compte.id
    delete compte.filtres
    compte.date_effet = now(DATEFORMAT)
    compte.date_effet_end = moment('2150-01-01')
      .tz('Europe/Paris')
      .format(DATEFORMAT)
    return Compte.update(
      {
        ...compte
      },
      { where: { id: id } }
    )
  }

  static async save(compte: any) {
    return Compte.create(compte)
  }

  static async findOneById(id: string) {
    return Compte.findOne({ where: { id: id } })
  }

  static getFiltre = async (compteId: number) => {
    return models.FiltreCompte.findAll({
      where: { t_compte_id: compteId },
      raw: true
    })
  }

  static updateFiltre = async (
    compteId: number,
    filtreId: number,
    value: string
  ) => {
    // upsert
    return models.FiltreCompte.upsert(
      { t_compte_id: compteId, t_filtre_compte_id: filtreId, value }, // Record to upsert
      { returning: true }
    )
  }

  static getTypeCompteById = (id: string) => {
    const value = typeCompteConfig[id]
    return value ? value : {}
  }

  static adaptTypeCompte(rows: any) {
    return rows.map(item => {
      item = item.toJSON()
      const value = this.getTypeCompteById(
        item.t_type_compte_id ? item.t_type_compte_id.toString() : ''
      )

      item.t_type_compte_name = value
      return item
    })
  }

  static async findCompteCodeAbsence(codeEtablissement) {
    const today = now(DATEFORMAT)
    return models.Compte.findAll({
      where: { 
        //TODO: change from_erp par role utilisateur (request RG)
        [Op.or]: [{
          from_erp: 0
        },
          { 
            from_erp: 1
        }],
        pc: {
          [Op.in]: ['PC500','PC502','PC504','PC009']
        },
        t_etablissement_code: codeEtablissement,
        date_effet: {
          [Op.lte]: today
        },
        date_effet_end: {
          [Op.gte]: today
        },
        visible: 1,
      },
      raw: true
    })
  }

  static async findFilterCompte(idFilter: number, codeEtablissement: string): Promise<any> {

    const compteEtablissementQuery = `select id from t_compte where t_etablissement_code = '${codeEtablissement}'`
    
    let result = []
    try {
      result = await DB.query(compteEtablissementQuery, {
        type: QueryTypes.SELECT,
        raw: true
      })
      result = result.map(item => {
        return item.id
      })

      const filtersQuery = `select distinct value from t_filtre_compte where t_filtre_compte_id = '${idFilter}' 
          and t_compte_id in (${result}) and value <> '' order by value ASC`
    
      result = await DB.query(filtersQuery, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }

  static async findComptesWithFilters(specialite: number, typeCompte: number, filters: string, 
                                      search: string, codeEtablissement: string, uosCodes: any[], isSuper: boolean, rgCodes: any[], comptesVisible: any[]): Promise<any> {
    let result = []
    const today = now(DATEFORMAT)
    const andRequestDate = `and (date_effet <= CAST('${today}' AS DATE) and date_effet_end >= CAST('${today}' AS DATE))`

    //TODO: ajout gestion des erp par role utilisateur
    const andRequestRg = this.getRgRequest(isSuper, rgCodes)
  
    let andRequest = `and t_etablissement_code = '${codeEtablissement}' `
    
    try {
      if (uosCodes !== undefined && uosCodes.length !== 0) {
          andRequest += `and id in (${uosCodes}) `
      }

      if (comptesVisible !== undefined && comptesVisible.length !== 0) {
        andRequest += `and id in (${comptesVisible}) `
      }

      let request = `select * from t_compte where cpt_intermediaire = '0' ${andRequestDate} ${andRequestRg} `
      if (search !== undefined && search !== null && search != '') {
        request += `and (nom LIKE '%${search}%' or designation LIKE '%${search}%') `
      } else {
        if (specialite !== undefined && specialite !== null && specialite != -1) {
          request += `and t_specialite_id in ('5', '${specialite}') `
        }
        if (typeCompte !== undefined && typeCompte !== null && typeCompte != -1) {
          request += `and t_type_compte_id = '${typeCompte}' `
        }
        if (filters !== undefined && filters !== null) {
          const filtersMap = JSON.parse(filters)
          if (filtersMap != {}) {
            for (const id in filtersMap) {
              if (filtersMap[id] != '') {
                let resultFilter = []
                const requestFilter = `select t_compte_id from t_filtre_compte 
                  where t_filtre_compte_id = '${id}' 
                  and value = '${filtersMap[id]}' and value <> '' order by value;`

                resultFilter = await DB.query(requestFilter, {
                  type: QueryTypes.SELECT,
                  raw: true
                })
                resultFilter = resultFilter.map(item => {
                  return item.t_compte_id
                })

                request += `and id in (${resultFilter}) `
              }
            }
          }
        }
      }
      request += `and visible = '1' ${andRequest} order by nom LIMIT 1000;`

      result = await DB.query(request, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }

  static getRgRequest(isSuper, rgCodes) {
    let request = 'and (from_erp = \'0\' '
    if (isSuper) {
      request += 'OR from_erp = \'1\') '
    } else if (rgCodes && rgCodes.length > 0) {
      request += `OR (pc, projet, activite) in (select bupc, projet, activite from t_compte_accessible where t_rg_code in ${rgCodes}) `
    }
    return request
  }

  static async findCompteVisible(userId: number) {
    const result = await models.CompteVisible.findAll({
      raw: true,
      attributes: ['t_compte_id'],
      where: {
        t_user_id: userId
      }
    })

    return result.map((element) => {
      return element.t_compte_id
    })
  }

  static async findCompteErpBy(bupc: string, projet: string, activite: string, date: string) {
    return await models.CompteErp.findOne({
      where: {
        bupc: bupc,
        projet: projet,
        activite: activite,
        date_effet: {
          [Op.lte]: date
        },
        date_effet_end: {
          [Op.gte]: date
        },
        projet_statut: 1,
        activite_statut: 1
      }
    })
  }

  static async existCompteAccessible(bupc: string, projet: string, activite: string, date: string) {
    //TODO add restriction sur t_rg_code par profil
    return await models.CompteAccessible.findOne({
      where: {
        bupc: bupc,
        projet: projet,
        activite: activite,
        date_effet: {
          [Op.lte]: date
        },
        date_effet_end: {
          [Op.gte]: date
        }
      }
    })
  }

  static async isCompteLocalisable(compteId: number) {
    return await models.Compte.findOne({
      where: {
        id: compteId,
        localisable: 1
      }
    })
  }
}

export default Repository
