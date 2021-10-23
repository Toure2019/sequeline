/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import { Sequelize } from 'sequelize'
import { Op } from 'sequelize'
import logger from '../../util/logger'
import Segment from '../segmentGestion/model'
import DepartementSegmentGestion from '../SegmentBupcDepartement/model'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    codeEtablissement: string
  ): Promise<any> {
    const etablissementCriteria = codeEtablissement
      ? { t_etablissement_code: codeEtablissement }
      : { }

    const ordering = this.getOrdering(orderByCol, direction)

    let result: any
    try {
      result = await models.SegmentGestion.findAndCountAll({
        order: ordering,
        raw: false,
        nest: true,
        distinct: true,
        include: [
          {
            model: models.SegmentBUPC,
            required: false
          },
          {
            model: models.DepartementSegmentGestion,
            required: false,
            include: [
              { model: models.Departement, attributes: ['code', 'libelle'] }
            ],
            where: {
              ...etablissementCriteria
            }
          }
        ],
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
    orderByCol: string = 'id',
    direction: string = 'ASC',
    codeEtablissement: string
  ): Promise<any> {

    const etablissementCriteria = codeEtablissement
      ? { t_etablissement_code: codeEtablissement }
      : { }
    
    const ordering = this.getOrdering(orderByCol, direction)
    let resultFiltered: any
    let unfilteredCount: number
    try {
      resultFiltered = await models.SegmentGestion.findAndCountAll({
        where: {
          [Op.and]: Sequelize.literal(
            `(t_segment_gestion.code||t_segment_gestion.nom) like '%${keyword}%'`
          )
        },
        order: ordering,
        distinct: true,
        raw: false,
        nest: true,
        include: [
          {
            model: models.SegmentBUPC,
            required: false
          },
          {
            model: models.DepartementSegmentGestion,
            required: false,
            include: [{ model: models.Departement }],
            where: {
              ...etablissementCriteria
            }
          }
        ],
        ...paginate(page, pageSize)
      })

      unfilteredCount = await models.Departement.count({
        order: [[orderByCol, direction]],
        raw: false,
        nest: true,
        include: [
          {
            model: models.SegmentBUPC,
            required: false
          },
          {
            model: models.DepartementSegmentGestion,
            required: false,
            include: [{ model: models.Departement }]
          }
        ]
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

  static getOrdering(orderByCol, direction) {
    let ordering = [[orderByCol, direction]]
    if (orderByCol === 'bupc') {
        ordering = [['t_bupc_segment_gestions', 'bupc', direction]]
    }
    return ordering
  } 

  static async update(segment: any) {
    try {
      if (segment.departements) {
        await this.clearDepartementSegment(segment, false)
        await DepartementSegmentGestion.bulkCreate(this.getDepartementSegmentToAdd(segment, false))
        delete segment.departements
      }
      if (segment.departementsClient) {
        await this.clearDepartementSegment(segment, true)
        DepartementSegmentGestion.bulkCreate(this.getDepartementSegmentToAdd(segment, true))
        delete segment.departementsClient
      }
      segment = {
        id: segment.id,
        code: segment.code,
        nom: segment.nom,
        visible: segment.visible
      }
    } catch (err) {
      console.error(err.message)
    }

    return Segment.update(segment, { where: { id: segment.id } })
  }

  static async clearDepartementSegment(segment, toClient) {
    await DepartementSegmentGestion.destroy({
      where: { t_segment_gestion_id: segment.id,
                t_etablissement_code: segment.codeEtablissement,
                to_client: toClient ? 1 : 0 }
    })
  }

  static getDepartementSegmentToAdd(segment, toClient) {
    const departementsToAdd = []
    const depts = toClient ? segment.departementsClient : segment.departements
    for (const dept of depts) {
      const toAdd = {
        t_departement_code: dept,
        t_segment_gestion_id: segment.id,
        t_etablissement_code: segment.codeEtablissement,
        to_client: toClient ? 1 : 0,
      }
      departementsToAdd.push(toAdd)
    }
    return departementsToAdd
  }

  static async findOneById(id: string) {
    return Segment.findOne({
      where: { id },
      raw: false,
      nest: true,
      include: [
        {
          model: models.SegmentBUPC,
          required: false
        },
        {
          model: models.DepartementSegmentGestion,
          required: false,
          include: [{ model: models.Departement }]
        }
      ]
    })
  }
}

export default Repository
