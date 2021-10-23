import { Request } from 'express'
import { writeToString } from '@fast-csv/format'
import Repository from './repository'
import { get422Error } from '../../../util/util'

class Service {
  // We check the params sent by the api
  static validateRequest = (req: Request, schema: any) => {
    const response = schema.validate(req.query)

    // we check for errors
    if (response.error) {
      const error = get422Error(response)

      return error
    }

    return response.value
  }

  static async getData(codeEtablissement: number) {
    const data = await Repository.getAllSegmentGestions().catch(
      (err: Error) => err
    )

    if (data instanceof Error) {
      return data
    }

    const columns = [
      'Code',
      'Nom',
      'BUPC',
      'Departements',
      'Departements client',
      'Actif'
    ]

    // we create a clean array
    const rows: any[] = []
    for (let index = 0; index < data.length; index++) {
      const x: any = data[index]

      const bupcCode = await Repository.getBUPCCode(x.id)

      const departements = await Repository.getDepartementsCode(
        x.id,
        codeEtablissement,
        0
      )

      const departementsClient = await Repository.getDepartementsCode(
        x.id,
        codeEtablissement,
        1
      )

      const visible = x.visible == '1' ? 'OUI' : 'NON'

      rows.push([
        x.code,
        x.nom,
        bupcCode,
        departements,
        departementsClient,
        visible
      ])
    }

    // Add the columns array at first
    rows.unshift(columns)

    return writeToString(rows, { quoteColumns: true, delimiter: ';' })
  }
}

export default Service
