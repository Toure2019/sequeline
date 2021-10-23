import Repository from './repository'
import rgSchema from './rgSchema'
import Rg from './model'
import { get422Error } from '../../util/util'

class Service {
  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string
  ): Promise<any> {
    return Repository.findAll(page, pageSize, orderByCol, direction)
  }

  static search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string
  ): Promise<any> {
    return Repository.search(keyword, page, pageSize, orderByCol, direction)
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string
  ) {
    if (keyword) {
      return this.search(keyword, page, pageSize, orderByCol, direction)
    } else {
      return this.findAll(page, pageSize, orderByCol, direction)
    }
  }

  static update(rg: Rg): Promise<any> {
    return Repository.update(rg)
  }

  static updateType(id: string, type: string): Promise<any> {
    return Repository.updateType(id, type)
  }

  static async validateRequest(data: any) {
    const response = rgSchema.validate(data)
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
  static async delete(code: string) {
    return Repository.delete(code)
  }

  static async getAllRgByEtablissement(codeEtablissement: string) {
    return Repository.findAllBy(codeEtablissement)
  }
}

export default Service
