/* eslint-disable @typescript-eslint/camelcase */
import { Op } from 'sequelize'

import models from '../../index'
import { DATEFORMAT, now } from '../../../util/util'

class Repository {
  static getAllSegmentGestions = async () => {
    return models.SegmentGestion.findAll({
      order: [['nom', 'ASC']],
      raw: true
    })
  }

  static getBUPCCode = async (id: number) => {
    const currentDate = now(DATEFORMAT)

    const bupc = await models.SegmentBUPC.findAll({
      attributes: ['bupc'],
      where: {
        date_effet: {
          [Op.lte]: currentDate
        },
        date_effet_end: {
          [Op.gt]: currentDate
        },
        t_segment_gestion_id: id
      }
    })

    // return only bupc value
    return bupc.map((x: any) => x.bupc)
  }

  static departementSegmentGestion = (
    id: number,
    codeEtablissement: number,
    client: number
  ) => {
    return models.DepartementSegmentGestion.findAll({
      attributes: ['t_departement_code'],
      where: {
        to_client: client,
        t_segment_gestion_id: id,
        t_etablissement_code: codeEtablissement
      }
    })
  }

  static getDepartementsCode = async (
    id: number,
    codeEtablissement: number,
    client: number = 0
  ) => {
    const departementSegmentGestion = await Repository.departementSegmentGestion(
      id,
      codeEtablissement,
      client
    )

    // create an array with only t_departement_code values
    const codeDepartementSegmentGestion = await departementSegmentGestion.map(
      (x: any) => x.t_departement_code
    )

    // get departement
    const departements = await models.Departement.findAll({
      where: {
        code: codeDepartementSegmentGestion
      },
      raw: true
    })

    // create an array with only t_departement_code values
    const codeDepartement = await departements.map((x: any) => x.code.trim())

    return codeDepartement.join('|')
  }
}

export default Repository
