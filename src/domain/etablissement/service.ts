import Repository from './repository'
import Etablissement from './models/etablissement'
import etablissementSchema from './etablissementSchema'
import { get422Error } from '../../util/util'

class Service {
  static findAllEtablissements() {
    return Repository.findAllEtablissements()
  }

  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    typeUo: string
  ): Promise<any> {
    return Repository.findAll(page, pageSize, orderByCol, direction, typeUo)
  }

  static findAllTypeEtablissement(): Promise<any> {
    return Repository.findAllTypeEtablissement()
  }

  static search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    typeUo: string
  ): Promise<any> {
    return Repository.search(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      typeUo
    )
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    typeUo: string
  ) {
    if (orderByCol === 'type') {
      orderByCol = 't_type_etablissement_code'
    }
    if (keyword) {
      return this.search(keyword, page, pageSize, orderByCol, direction, typeUo)
    } else {
      return this.findAll(page, pageSize, orderByCol, direction, typeUo)
    }
  }

  static update(etab: Etablissement): Promise<any> {
    return Repository.update(etab)
  }

  static async validateRequest(data: any) {
    const response = etablissementSchema.validate(data)
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
}

export default Service
