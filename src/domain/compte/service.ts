import Repository from './repository'
import CompteSchema from './CompteSchema'
import SpecialiteService from '../specialite/service'
import TypeCompteService from '../typeCompte/service'
import UoFavorisService from '../uoFavoris/service'
import UserService from '../user/service/user'
import RgService from '../Rg/service'
import { get422Error } from '../../util/util'

class Service {
  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    showInactif: boolean,
    codeEtablissement: string,
    noProductif: string,
    noPagination: boolean
  ): Promise<any> {
    return Repository.findAll(
      page,
      pageSize,
      orderByCol,
      direction,
      showInactif,
      codeEtablissement,
      noProductif,
      noPagination
    )
  }

  static search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    showInactif: boolean,
    codeEtablissement: string
  ): Promise<any> {
    return Repository.search(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      showInactif,
      codeEtablissement
    )
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    showInactif: string,
    codeEtablissement: string,
    noProductif: string,
    noPaging: boolean
  ) {
    let boolshowInactif
    try {
      if (showInactif !== undefined) {
        boolshowInactif = JSON.parse(showInactif)
      } else {
        boolshowInactif = false
      }
    } catch (err) {
      console.error(err)
    }

    if (keyword) {
      return this.search(
        keyword,
        page,
        pageSize,
        orderByCol,
        direction,
        boolshowInactif,
        codeEtablissement
      )
    } else {
      return this.findAll(
        page,
        pageSize,
        orderByCol,
        direction,
        boolshowInactif,
        codeEtablissement,
        noProductif,
        noPaging
      )
    }
  }

  static update(compte: any): Promise<any> {
    return Repository.update(compte)
  }

  static save(compte: any): Promise<any> {
    return Repository.save(compte)
  }

  static async validateRequest(data: any) {
    const response = CompteSchema.validate(data)
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

  static getFiltre = async (compteId: number) => {
    return Repository.getFiltre(compteId)
  }

  static async updateCompteFiltre(compte: any) {
    // we update the filtre Famille
    compte.filtres.forEach(async item => {
      await Repository.updateFiltre(compte.id, item.id, item.value)
    })

    // we update the filtre Nature

    return Promise.resolve('Success')
  }

  static async getCompteForCodeAbsence(codeEtablissement: string) {
    return Repository.findCompteCodeAbsence(codeEtablissement)
  }

  static async getFilterCompteValues(
    idFilter: number,
    codeEtablissement: string
  ) {
    return Repository.findFilterCompte(idFilter, codeEtablissement)
  }

  static async getSpecialite() {
    return SpecialiteService.findAll()
  }

  static async getTypeCompte() {
    return TypeCompteService.findAll()
  }

  static async getComptesWithFilters(
    user: any,
    specialite: number,
    typeCompte: number,
    filters: string,
    search: string,
    codeEtablissement: string,
    courant: string
  ) {
    let boolCourant
    try {
      boolCourant = JSON.parse(courant)
      let comptesVisible = []
      if (boolCourant) {
        comptesVisible = await this.findCompteVisible(user.id)
      }
      const uosCodes = await UoFavorisService.findUoFavorisBy(
        user,
        codeEtablissement,
        't_compte'
      )
      let rgCodes = []
      if (user.role.id === 11 || user.role.id === 9) {
        // Admin ou CGIE
        const rg = await RgService.getAllRgByEtablissement(codeEtablissement)
        rgCodes = rg.map(e => {
          return e.code
        })
      } else {
        const userProperties = await UserService.getRecentUserProperties(
          user.id
        )
        rgCodes.push(userProperties?.t_departement?.t_rg.code)
      }
      return Repository.findComptesWithFilters(
        specialite,
        typeCompte,
        filters,
        search,
        codeEtablissement,
        uosCodes,
        user.role.id === 1,
        rgCodes,
        comptesVisible
      )
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }

  static async findCompteVisible(userId: number) {
    return await Repository.findCompteVisible(userId)
  }

  static async findCompteErpBy(
    bupc: string,
    projet: string,
    activite: string,
    date: string
  ) {
    return await Repository.findCompteErpBy(bupc, projet, activite, date)
  }

  static async existCompteAccessible(
    bupc: string,
    projet: string,
    activite: string,
    date: string
  ) {
    return await Repository.existCompteAccessible(bupc, projet, activite, date)
  }

  static async isCompteLocalisable(compteId: number) {
    return (await Repository.isCompteLocalisable(compteId)) !== null
  }
}

export default Service
