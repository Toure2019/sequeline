import Repository from './repository'
import Etablissement from './model'
import departementSchema from './departementSchema'
import UoFavoriService from '../uoFavoris/service'
import { get422Error } from '../../util/util'

class Service {
  static findAll(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string = undefined
  ): Promise<any> {
    return Repository.findAll(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement
    )
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string
  ) {
    return this.findAll(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement
    )
  }

  static update(etab: Etablissement): Promise<any> {
    return Repository.update(etab)
  }

  static async validateRequest(data: any) {
    const response = departementSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneByCode(code: string) {
    return Repository.findOneByCode(code)
  }

  static async findByFilter(
    user: any,
    codeEtablissement: string,
    favori: string,
    equipeId: number = undefined
  ) {
    let boolFavori
    try {
      boolFavori = JSON.parse(favori)
    } catch (err) {
      console.error(err)
    }
    let uos = []

    if (boolFavori) {
      uos = await UoFavoriService.findUoFavorisBy(
        user,
        codeEtablissement,
        't_departement',
        equipeId
      )
    }
    return Repository.findByFilter(boolFavori, uos)
  }
}

export default Service
