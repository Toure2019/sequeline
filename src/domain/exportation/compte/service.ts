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

  static async getData(userId: number, codeEtablissement: number) {
    const data = await Repository.getAllComptes(
      userId,
      codeEtablissement
    ).catch((err: Error) => err)

    if (data instanceof Error) {
      return data
    }

    const columns = [
      'Compte',
      'Designation',
      'Code UOP',
      'UO max / jour',
      'UO max / semaine',
      'Type',
      'specialite',
      'Famille',
      'Nature',
      'Localisable',
      'Mobilite',
      'Compte non productif',
      'PC',
      'Projet',
      'Activite',
      'sous_categorie_sinistre',
      'Rapport',
      'Intermediaire',
      'sous_categories_config',
      'favoris uos'
    ]

    // we create a clean array
    const rows: any[] = []
    for (let index = 0; index < data.length; index++) {
      const x: any = data[index]

      const compteName = Repository.getTypeCompteName(x.t_type_compte_id)
      const compteSpeciality = Repository.getSpecialite(x.t_specialite_id)
      const famille = await Repository.getFiltreValue(x.id, 1)
      const nature = await Repository.getFiltreValue(x.id, 2)
      const localisable = x.localisable == '1' ? 'OUI' : 'NON'
      const mobilite = x.mobilite == '1' ? 'OUI' : 'NON'
      const noProductif = x.no_productif == '1' ? 'OUI' : 'NON'
      const cptIntermediaire = x.cpt_intermediaire == '1' ? 'OUI' : 'NON'
      const cptIntermediaireSousCat = await Repository.getCptIntermediaire(
        x.cpt_intermediaire,
        codeEtablissement,
        x.pc,
        x.projet,
        x.activite
      )
      const uoFav = await UoRepository.getUosFavorites(
        x,
        codeEtablissement,
        't_compte'
      )

      rows.push([
        x.nom,
        x.designation,
        x.code_uop,
        x.qte_uo_max_day,
        x.qte_uo_max_week,
        compteName,
        compteSpeciality,
        famille,
        nature,
        localisable,
        mobilite,
        noProductif,
        x.pc,
        x.projet,
        x.activite,
        x.sous_categorie,
        x.need_rapport,
        cptIntermediaire,
        cptIntermediaireSousCat,
        uoFav
      ])
    }

    // Add the columns array at first
    rows.unshift(columns)

    return writeToString(rows, { quoteColumns: true, delimiter: ';' })
  }
}

export default Service
