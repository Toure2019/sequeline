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
    const data = await Repository.getAllUsersAndEquipes(
      codeEtablissement
    ).catch((err: Error) => err)

    if (data instanceof Error) {
      return data
    }

    const columns = [
      'cp',
      'nom',
      'prenom',
      'code sous-equipe',
      'libelle sous-equipe'
    ]

    // we create a clean array
    const rows = data.map((x: any) => {
      return [x.login, x.nom_agent, x.prenom, x.num_equipe, x.nom]
    })

    // Add the columns array at first
    rows.unshift(columns)

    //   const rows = [
    //     ['col1', 'col2', 'col3'],
    //     ['a1', 'b1'],
    //     ['a2', 'b2']
    //   ]

    return writeToString(rows, { quoteColumns: true, delimiter: ';' })
  }
}

export default Service
