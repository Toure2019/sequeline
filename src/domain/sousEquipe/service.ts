/* eslint-disable @typescript-eslint/camelcase */
import Repository from './repository'
import equipeSchema from './equipeSchema'
import UoService from '../uo/service'
import { get422Error } from '../../util/util'
import moment from 'moment-timezone'

class Service {
  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string,
    codeUO: string,
    noPaging: boolean
  ): Promise<any> {
    return Repository.findAll(
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement,
      codeUO,
      noPaging
    )
  }

  static search(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string,
    codeUO: string,
    noPaging: boolean
  ): Promise<any> {
    return Repository.search(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement,
      codeUO,
      noPaging
    )
  }

  static findAllOrSearch(
    keyword: string,
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    codeEtablissement: string,
    codeUO: string,
    noPaging: boolean
  ) {
    if (keyword) {
      return this.search(
        keyword,
        page,
        pageSize,
        orderByCol,
        direction,
        codeEtablissement,
        codeUO,
        noPaging
      )
    } else {
      return this.findAll(
        page,
        pageSize,
        orderByCol,
        direction,
        codeEtablissement,
        codeUO,
        noPaging
      )
    }
  }

  static update(equipe: any): Promise<any> {
    if (equipe.date_end === null) {
      equipe.date_end = moment('2150-01-01').format('YYYY-MM-DD')
    } else {
      equipe.date_end = moment(equipe.date_end).format('YYYY-MM-DD')
    }
    return Repository.update(equipe)
  }

  static save(equipe: any): Promise<any> {
    equipe = this.addSearch(equipe)
    return Repository.save(equipe)
  }

  static addSearch(equipe: any): any {
    equipe.search = `${String(equipe.num_equipe).toLowerCase()} ${
      equipe.t_uo_code
    } ${equipe.t_departement_code} ${equipe.nom}`
    if (!equipe.date_end) {
      equipe.date_end = moment('2150-01-01').format('YYYY-MM-DD')
    } else {
      equipe.date_end = moment(equipe.date_end).format('YYYY-MM-DD')
    }
    return equipe
  }

  static async validateRequest(data: any) {
    const response = equipeSchema.validate(data)
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

  static async findSousEquipeChantier(codeEtablissement: string) {
    const uoCodes = await UoService.findAllByEtablissementAndDateEffect(
      codeEtablissement,
      false.toString()
    )
    if (uoCodes != undefined && uoCodes.length > 0) {
      const uos = []
      uoCodes.forEach(item => {
        uos.push(item.get('code'))
      })
      return Repository.findAllByUo(uos)
    }
  }

  static async getEquipeRgType(equipeId: number) {
    return Repository.getEquipeRgType(equipeId)
  }
}

export default Service
