/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import { Sequelize } from 'sequelize'
import { Op } from 'sequelize'
import logger from '../../util/logger'
import CodeAbsence from './model'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'code',
    direction: string = 'ASC',
    codeEtablissement: string = null
  ): Promise<any> {
    const etablissementCriteria =
      codeEtablissement !== null && codeEtablissement !== undefined
        ? {
            where: {
              [Op.or]: [
                { t_etablissement_code: codeEtablissement },
                { t_etablissement_code: null }
              ]
            }
          }
        : {}

    let result: any
    try {
      result = await models.CodeAbsence.findAndCountAll({
        ...etablissementCriteria,
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
    orderByCol: string = 'code',
    direction: string = 'ASC',
    codeEtablissement: string = null
  ): Promise<any> {
    const etablissementCriteria =
      codeEtablissement !== null && codeEtablissement !== undefined
        ? {
            [Op.or]: [
              { t_etablissement_code: codeEtablissement },
              { t_etablissement_code: null }
            ]
          }
        : {}
    const resultFiltered = await models.CodeAbsence.findAndCountAll({
      where: {
        [Op.and]: Sequelize.literal(
          `(t_code_absence.code||t_code_absence.nom) like '%${keyword}%' `
        ),
        ...etablissementCriteria
      },
      order: [[orderByCol, direction]],
      raw: false,
      nest: true,

      ...paginate(page, pageSize)
    })

    const countUnFiltered = await models.CodeAbsence.count({
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

  static async findAllBy(
    codeEtablissement: string,
    journalier: string
  ): Promise<any> {
    let result: any
    try {
      const journalierCriteria =
        journalier !== undefined
          ? { journalier: JSON.parse(journalier) === true ? 1 : 0 }
          : {}

      result = await models.CodeAbsence.findAll({
        where: {
          t_etablissement_code: codeEtablissement,
          ...journalierCriteria
        },
        raw: true
      })
    } catch (err) {
      logger.debug(err.message)
    }

    return result
  }

  static async update(codeAbsence: any) {
    return CodeAbsence.update(codeAbsence, {
      where: { id: codeAbsence.id }
    })
  }

  static async add(codeAbsence: any) {
    return CodeAbsence.create(codeAbsence)
  }

  static async findOneByCode(code: number) {
    return CodeAbsence.findOne({ where: { id: code } })
  }
}

export default Repository
