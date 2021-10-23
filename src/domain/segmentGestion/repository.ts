/* eslint-disable @typescript-eslint/camelcase */
import { Op } from 'sequelize'
import DB from '../../database/connection'
import { QueryTypes } from 'sequelize'
import Segment from './model'
import { DATEFORMAT, now } from '../../util/util'

class Repository {

  static async findAllBy(codeEtablissement: string, toClient: string, idDepartement: string, bupc: string) {
    const today = now(DATEFORMAT)

    let boolToClient
    try {
        boolToClient = JSON.parse(toClient)
    } catch (err) {
        console.error(err)
    }

    const requestVarToClient = boolToClient && idDepartement !== undefined && idDepartement !== '' ? '1' : '0'
    const requestVarDepartement = idDepartement !== undefined && idDepartement !== '' ? `and t_departement_code = '${idDepartement}'` : ''

    const request = `select t_segment_gestion_id from t_departement_segment_gestion where to_client = ${requestVarToClient} ${requestVarDepartement} 
                    and t_etablissement_code = '${codeEtablissement}';`

    let segmentGestionDepartementIds = []
    let segmentGestionBupcIds = []
    try {
        segmentGestionDepartementIds = await DB.query(request, {
            type: QueryTypes.SELECT,
            raw: true
        })
        segmentGestionDepartementIds = segmentGestionDepartementIds.map(item => {
            return item.t_segment_gestion_id
        })

        if (bupc !== '') {
            const andRequestDate = `and (date_effet <= CAST('${today}' AS DATE) and date_effet_end >= CAST('${today}' AS DATE)) `
            const requestBupc = `select t_segment_gestion_id from t_bupc_segment_gestion where bupc = '${bupc}' and enabled = '1' ${andRequestDate};`
            segmentGestionBupcIds = await DB.query(requestBupc, {
                type: QueryTypes.SELECT,
                raw: true
            })
            segmentGestionBupcIds = segmentGestionBupcIds.map(item => {
                return item.t_segment_gestion_id
            })
        }
    } catch (err) {
        console.error(err)
    }

    const segmentIdsCriteria = segmentGestionDepartementIds.length !== 0 ?
        { id: { [Op.in]: segmentGestionDepartementIds } } :
        { id: -2 }

    const segmentIdsBupcCriteria = segmentGestionBupcIds.length !== 0 ?
        { id: { [Op.in]: segmentGestionBupcIds } } :
        { }

    return Segment.findAll({
      where: {
        visible: 1,
        ...segmentIdsCriteria,
        ...segmentIdsBupcCriteria
      },
      order:[['nom', 'ASC']],
    })
  }
}

export default Repository
       