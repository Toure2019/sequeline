/* eslint-disable @typescript-eslint/camelcase */
import models from '../index'
import paginate from '../../util/database'
import { Sequelize, Op } from 'sequelize'
import UO from './models/uo'
import { DATEFORMAT, now } from '../../util/util'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC',
    typeUo: string,
    noPaging: boolean = false,
    codeEtab: string
  ): Promise<any> {
    const ordering = this.getOrdering(orderByCol, direction)
    const pagination = !noPaging ? paginate(page, pageSize) : {}
    const criteria = typeUo ? { code: typeUo } : {}
    const etabCriteria = codeEtab
      ? { where: { t_etablissement_code: codeEtab, enabled: 1 } }
      : {}

    const result: any = await models.UO.findAndCountAll({
      ...etabCriteria,
      nest: true,
      distinct: 'code',
      include: [
        {
          model: models.TypeUo,
          attributes: ['code', 'libelle'],
          where: { ...criteria },
          include: [{ model: models.NiveauUo }]
        },
        {
          model: models.Departement,
          attributes: ['code', 'libelle']
        },
        {
          model: models.UO,
          required: false,
          as: 'parentUO',
          attributes: ['code', 'libelle']
        }
      ],
      order: ordering,
      raw: true,
      ...pagination
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
    direction: string = 'ASC',
    typeUo: string,
    codeEtab: string
  ): Promise<any> {
    const ordering = this.getOrdering(orderByCol, direction)
    const etabCriteria = codeEtab
      ? { where: { t_etablissement_code: codeEtab, enabled: 1 } }
      : {}
    const criteria = typeUo ? { code: typeUo } : {}
    const resultFiltered = await models.UO.findAndCountAll({
      where: {
        [Op.and]: Sequelize.literal(
          `t_uo.enabled=1 AND (t_uo.code||t_uo.libelle||t_uo.libelle_min||
            t_departement.code||t_departement.libelle) like '%${keyword}%' AND t_uo.t_etablissement_code='${codeEtab}' `
        )
      },
      order: ordering,
      raw: false,
      nest: true,
      include: [
        {
          model: models.TypeUo,
          attributes: ['code', 'libelle'],
          where: { ...criteria },
          include: [{ model: models.NiveauUo }]
        },
        {
          model: models.Departement,
          required: false,
          attributes: ['code', 'libelle']
        },
        {
          model: models.UO,
          required: false,
          as: 'parentUO',
          attributes: ['code', 'libelle']
        }
      ],

      ...paginate(page, pageSize)
    })

    const countUnFiltered = await models.UO.count({
      ...etabCriteria,
      order: [[orderByCol, direction]],
      raw: false,
      nest: true,
      include: [
        {
          model: models.TypeUo,
          attributes: ['code', 'libelle'],
          include: [{ model: models.NiveauUo }]
        },
        {
          model: models.Departement,
          required: false,
          attributes: ['code', 'libelle']
        },
        {
          model: models.UO,
          required: false,
          as: 'parentUO',
          attributes: ['code', 'libelle']
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
    if (orderByCol === 'niveau') {
      ordering.push([models.TypeUo, models.NiveauUo, 'code', direction])
    } else if (orderByCol === 'code_parent') {
      ordering.push(['parentUO', 'libelle', direction])
    } else if (orderByCol === 'departement') {
      ordering.push([models.Departement, 'libelle', direction])
    } else {
      ordering.push([orderByCol, direction])
    }
    return ordering
  }

  static async update(rg: any) {
    return UO.update(rg, { where: { code: rg.code } })
  }

  static async findOneByCode(code: string) {
    return UO.findOne({ where: { code } })
  }

  static async findAllByEtablissementAndDateEffect(codeEtablissement: string, all: string) {
    const today = now(DATEFORMAT)

    let boolAll: boolean
    try {
      boolAll = JSON.parse(all)
    } catch (err) {
      console.error(err)
    }

    const allCriteria = boolAll === false ?
      { enabled: 1 } :
      { }

    return UO.findAll({
      attributes: ['code'],
      where: {
        t_etablissement_code: codeEtablissement,
        date_effet: {
          [Op.lte]: today
        },
        date_effet_end: {
          [Op.gte]: today
        },
        ...allCriteria
      }
    })
  }

  static async findAllUosGroupByDepartement(currentDate: string, codeEtablissement: string){
    let uosCount = 0
    const departements: any = await models.Departement.findAll({
      attributes: [
        'code', ['libelle_min', 'libelle'],
      ],
      include: [
        {
          model: models.UO,
          as: 'uos',
          attributes: ['code', ['libelle_min', 'libelle']],
          where: { t_etablissement_code: codeEtablissement, date_effet: {
            [Op.lte]: currentDate
          },
          date_effet_end: {
            [Op.gte]: currentDate
          }, }
        },
      ],
      where: { enabled: 1},
      distinct: 'code',
    })
    
    for (const departement of departements) {
      uosCount += departement.uos.length
    }

    return  {
      departements,
      departementsCount: departements?.length,
      uosCount
    }
  }

  static async findAllSousEquipesByUO(
    codeUO: string[]){
    let sousEquipesCount = 0
    const uos: any = await models.UO.findAll({
      attributes: [
        'code', ['libelle_min', 'libelle']
      ],
      include: [
        {
          model: models.SousEquipe,
          as: 'sousEquipes',
          attributes: ['id' ,['num_equipe', 'numEquipe'], 'nom'],
          where: {
            t_uo_code: {
              [Op.in]: codeUO
            }
          }
        },
      ],
      where: { enabled: 1},
      distinct: 'code',
    })
    
    for (const uo of uos) {
      sousEquipesCount += uo.sousEquipes.length
    }

    return  {
      uos,
      uosCount: uos?.length,
      sousEquipesCount
    }
  }
  

}

export default Repository
