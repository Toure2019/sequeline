import Repository from './repository'
import enginSchema from './enginSchema'
import Rg from './model'
import UoFavoriService from '../uoFavoris/service'
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

  static async validateRequest(data: any) {
    const response = enginSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneById(id: number) {
    return Repository.findOneById(id)
  }
  static async delete(id: number) {
    return Repository.delete(id)
  }

  static async save(engin: any) {
    return Repository.add(engin)
  }

  static async findByFilter(user, codeEtablissement: string, favori: string, equipeId: number, all: string = false.toString()) {
    let boolFavori
    try {
      boolFavori = JSON.parse(favori)
    } catch (err) {
      console.error(err)
    }
    let uos = []

    if (boolFavori) {
      uos = await UoFavoriService.findUoFavorisBy(user, codeEtablissement, 't_engin', equipeId)
    }
    return Repository.findByFilter(all, boolFavori, uos)
  }
}

export default Service
