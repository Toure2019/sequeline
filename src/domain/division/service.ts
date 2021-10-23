import Repository from './repository'

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
}

export default Service
