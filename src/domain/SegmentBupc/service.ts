import Repository from './repository'
import SegmentSchema from './SegmentSchema'
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

  static async update(segment: any): Promise<any> {
    return await Repository.update(segment)
  }

  static async validateRequest(data: any) {
    const response = SegmentSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneById(id: string) {
    return Repository.findOneById(id)
  }
}

export default Service
