import { Request } from 'express'
import { writeToString } from '@fast-csv/format'
import Repository from './repository'
import UoRepository from '../uoRepository'
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
    const data = await Repository.getAllEngins().catch((err: Error) => err)

    if (data instanceof Error) {
      return data
    }

    const columns = ['CODE', 'LIBELLE', 'STATUT', 'UNITE', 'favoris uos']

    // we create a clean array
    const rows: any[] = []
    for (let index = 0; index < data.length; index++) {
      const x: any = data[index]
      const status = await Repository.getStatutLibelle(x)
      const unite = await Repository.getUniteLibelle(x)
      const uos = await UoRepository.getUosFavorites(
        x,
        codeEtablissement,
        't_engin'
      )
      rows.push([x.code, x.libelle, status, unite, uos])
    }

    // Add the columns array at first
    rows.unshift(columns)

    return writeToString(rows, { quoteColumns: true, delimiter: ';' })
  }
}

export default Service
