/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import { adaptEtablissement } from './adapter'
import models from '..'
import Etablissement from './models/etablissement'
import { Sequelize } from 'sequelize'
import { Op } from 'sequelize'
import logger from '../../util/logger'
import { serialize } from 'php-serialize'
import { DATEFORMAT, now } from '../../util/util'

class Repository {
  static async findAllEtablissements() {
    return await models.Etablissement.findAll({
      attributes: [
        'code',
        'libelle_min'
      ],
      where: {
        enabled: 1
      },
      raw: true
    })
  }

  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC',
    typeUo: string
  ): Promise<any> {
    let result: any
    const ordering = this.getOrdering(orderByCol, direction)
    let adaptedRes = {}
    const currentDate = now(DATEFORMAT)
    const criteria = typeUo ? { where: { code: typeUo } } : {}
    try {
      result = await models.Etablissement.findAndCountAll({
        where: {
          enabled: 1
        },
        order: ordering,
        distinct: true,
        raw: false,
        nest: true,
        include: [
          {
            model: models.EtablissementData,
            where: {
              date_effet: {
                [Op.lte]: currentDate
              },
              date_effet_end: {
                [Op.gt]: currentDate
              }
            }
          },
          {
            model: models.UO,
            attributes: ['code', 'libelle'],
            include: [
              { model: models.TypeUo, ...criteria },
              {
                model: models.Departement,
                attributes: ['code', 'libelle'],
                include: [
                  {
                    model: models.Rg,
                    attributes: ['code', 'libelle'],
                    include: [
                      {
                        model: models.Division,
                        attributes: ['code', 'libelle']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        ...paginate(page, pageSize)
      })
      adaptedRes = adaptEtablissement(result.rows)
    } catch (err) {
      logger.debug(err.message)
    }

    return {
      count: result.count,
      rows: adaptedRes,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static async findAllTypeEtablissement(): Promise<any> {
    let result: any

    try {
      result = await models.TypeEtablissement.findAndCountAll({
        raw: false,
        nest: true
      })
    } catch (err) {
      logger.debug(err.message)
    }

    return {
      ...result,
      recordsTotal: result.length,
      recordsFiltered: result.length
    }
  }

  static async search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC',
    typeUo: string
  ): Promise<any> {
    let filteredResult: any
    let unfilteredResultCount: number
    const ordering = this.getOrdering(orderByCol, direction)
    const currentDate = now(DATEFORMAT)
    const criteria = typeUo ? { where: { code: typeUo } } : {}

    try {
      filteredResult = await models.Etablissement.findAndCountAll({
        where: {
          [Op.and]: Sequelize.literal(
            `t_etablissement.enabled=1 AND (t_etablissement.code||t_etablissement.libelle||t_etablissement.libelle_min) like '%${keyword.toLowerCase()}%' `
          )
        },
        order: ordering,
        distinct: true,
        raw: false,
        nest: true,
        include: [
          {
            model: models.EtablissementData,
            where: {
              date_effet: {
                [Op.lte]: currentDate
              },
              date_effet_end: {
                [Op.gt]: currentDate
              }
            }
          },
          {
            model: models.UO,
            attributes: ['code', 'libelle'],
            include: [
              { model: models.TypeUo, ...criteria },
              {
                model: models.Departement,
                attributes: ['code', 'libelle'],
                include: [
                  {
                    model: models.Rg,
                    attributes: ['code', 'libelle'],
                    include: [
                      {
                        model: models.Division,
                        attributes: ['code', 'libelle']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        ...paginate(page, pageSize)
      })
      unfilteredResultCount = await models.Etablissement.count({
        where: {
          enabled: 1
        },
        order: [[orderByCol, direction]],
        raw: false,
        nest: true
      })
    } catch (err) {
      logger.debug(err.message)
    }

    const adaptedEtablissements = adaptEtablissement(filteredResult.rows)
    return {
      rows: adaptedEtablissements,
      page,
      pageSize,
      recordsTotal: unfilteredResultCount,
      recordsFiltered: filteredResult.count
    }
  }

  static getOrdering(orderByCol, direction) {
    const ordering = []
    if (orderByCol == 'uos') {
      ordering.push([models.UO, 'libelle', direction])
    } else if (orderByCol == 'divisions') {
      ordering.push([models.UO, models.Departement, models.Rg, models.Division, 'libelle', direction])
    } else {
      ordering.push([orderByCol, direction])
    }
    return ordering
  }

  static async update(etab: any) {
    if (etab.dpts) {
      const serializedArr = serialize(etab.dpts)
      await models.EtablissementData.update(
        { value: serializedArr },
        { where: { t_etablissement_code: etab.code, key: 'departements' } }
      )
      await models.EtablissementData.update(
        { value: etab.activeAsr },
        { where: { t_etablissement_code: etab.code, key: 'asr_active' } }
      )

      await models.EtablissementData.update(
        { value: etab.spotMobile },
        { where: { t_etablissement_code: etab.code, key: 'useSPOTmobile' } }
      )
      await models.EtablissementData.update(
        { value: etab.autreProcessCode },
        {
          where: {
            t_etablissement_code: etab.code,
            key: 'otherProcessCodeActivite'
          }
        }
      )
      await models.EtablissementData.update(
        { value: etab.autreProcessProjet },
        {
          where: {
            t_etablissement_code: etab.code,
            key: 'otherProcessProjetCompte'
          }
        }
      )
    }
    delete etab.dpts
    return Etablissement.update({ ...etab }, { where: { code: etab.code } })
  }

  static async findOneByCode(code: string) {
    return Etablissement.findOne({ where: { code } })
  }
}

export default Repository
