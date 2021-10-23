/* eslint-disable @typescript-eslint/camelcase */
import { QueryTypes } from 'sequelize'
import DB from '../../database/connection'
import { DATEFORMAT, now } from '../../util/util'

class Repository {
  static getUoFavorisCode = async (
    id: number,
    codeEtablissement: number,
    table: string
  ) => {
    const request = `select t_uo_code from t_favoris_uo 
    where t_table = '${table}' and t_table_id = '${id}' 
    and t_etablissement_code = '${codeEtablissement}'`

    const response = await DB.query(request, {
      type: QueryTypes.SELECT,
      raw: true
    })

    return response.map((x: any) => x.t_uo_code)
  }

  static getUoCode = async (
    id: number,
    codeEtablissement: number,
    table: string
  ) => {
    const currentDate = now(DATEFORMAT)

    const andRequestDate = `and date_effet <= '${currentDate}' and date_effet_end > '${currentDate}' `

    const request = `select * from t_uo where code in 
    (select t_uo_code from t_favoris_uo 
      where t_table = '${table}' 
      and t_table_id = '${id}' 
      and t_etablissement_code = '${codeEtablissement}') ${andRequestDate}`

    return DB.query(request, {
      type: QueryTypes.SELECT,
      raw: true
    })
  }

  static getUos = async (
    id: number,
    codeEtablissement: number,
    table: string
  ) => {
    // we get the t_uo_code from t_favoris_uo
    const uoFavorisCode = await Repository.getUoFavorisCode(
      id,
      codeEtablissement,
      table
    )

    // get only the uo with t_uo_code == -2 and we create a dummy uo from this
    let uoFromUoFavoriteCode: any = []
    if (uoFavorisCode.length > 0) {
      uoFromUoFavoriteCode = uoFavorisCode
        .filter((x: number) => {
          return x == -2
        })
        .map(() => {
          return { code: -2, libelle: 'Tous les uos' }
        })
    }

    // We get the real uo from t_uo
    const uoCode = await Repository.getUoCode(id, codeEtablissement, table)

    // We merge both array (uo from favorite and uo)
    return uoFromUoFavoriteCode.concat(uoCode)
  }

  static getUosFavorites = async (
    engin: { [key: string]: any },
    codeEtablissement: number,
    table: string
  ) => {
    const uoFav = await Repository.getUos(engin.id, codeEtablissement, table)

    const uoCodes = uoFav.map((x: any) => {
      if (x.code == -2) {
        return '*'
      }
      return x.code
    })

    return uoCodes.join('|')
  }
}

export default Repository
