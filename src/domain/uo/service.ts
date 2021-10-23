import Repository from './repository'

class Service {
  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    typeUo: string,
    noPaging: boolean = false,
    codeEtablissement: string
  ): Promise<any> {
    return Repository.findAll(
      page,
      pageSize,
      orderByCol,
      direction,
      typeUo,
      noPaging,
      codeEtablissement
    )
  }

  static search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    typeUo: string,
    codeEtablissement: string
  ): Promise<any> {
    return Repository.search(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      typeUo,
      codeEtablissement
    )
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    typeUo: string,
    noPaging: boolean,
    codeEtablissement: string
  ) {
    if (keyword) {
      return this.search(
        keyword,
        page,
        pageSize,
        orderByCol,
        direction,
        typeUo,
        codeEtablissement
      )
    } else {
      return this.findAll(
        page,
        pageSize,
        orderByCol,
        direction,
        typeUo,
        noPaging,
        codeEtablissement
      )
    }
  }

  static async findOneByCode(code: string) {
    return Repository.findOneByCode(code)
  }

  static async findAllByEtablissementAndDateEffect(codeEtablissement: string, all: string) {
    return Repository.findAllByEtablissementAndDateEffect(codeEtablissement, all)
  }
}

export default Service
