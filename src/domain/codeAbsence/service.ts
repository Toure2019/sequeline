import Repository from './repository'
import codeAbsenceSchema from './codeAbsenceSchema'
import { get422Error } from '../../util/util'

class Service {
  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string
  ): Promise<any> {
    return Repository.findAll(page, pageSize, orderByCol, direction, codeEtablissement)
  }

  static search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string
  ): Promise<any> {
    return Repository.search(keyword, page, pageSize, orderByCol, direction, codeEtablissement)
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string
  ) {
    if (keyword) {
      return this.search(keyword, page, pageSize, orderByCol, direction, codeEtablissement)
    } else {
      return this.findAll(page, pageSize, orderByCol, direction, codeEtablissement)
    }
  }

  static findAllBy(codeEtablissement: string, journalier: string) {
    return Repository.findAllBy(codeEtablissement, journalier)
  }

  static update(codeAbsence: any): Promise<any> {
    return Repository.update(codeAbsence)
  }

  static async validateRequest(data: any) {
    const response = codeAbsenceSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneByCode(code: number) {
    return Repository.findOneByCode(code)
  }

  static async add(codeAbsence: any) {
    return Repository.add(codeAbsence)
  }
}

export default Service
