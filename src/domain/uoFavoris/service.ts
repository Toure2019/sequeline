/* eslint-disable @typescript-eslint/camelcase */
import Repository from './repository'
import DepartementService from '../departement/service'
import UoService from '../uo/service'
import uoFavorisSchema from './uoFavorisSchema'
import UserService from '../user/service/user'
import EquipeService from '../sousEquipe/service'
import { get422Error } from '../../util/util'

class Service {
  static findAll(
    page: number,
    pageSize: number,
    orderByCol: string,
    direction: string,
    t_table: string,
    code: string,
    codeEtablissement: string,
    noPaging: boolean = false
  ): Promise<any> {
    return Repository.findAll(
      page,
      pageSize,
      orderByCol,
      direction,
      t_table,
      code,
      codeEtablissement,
      noPaging
    )
  }

  static async create(data: any) {
    const uoFavorisArr: any[] = []
    const uosArr = [...data.uos]
    delete data.uos
    if (data.t_table === 't_departement') {
      const dpt = await DepartementService.findOneByCode(data.t_table_id)
      if (dpt === undefined) {
        return null
      }
    }
    for (let i = 0; i < uosArr.length; i++) {
      const code = uosArr[i]
      const uo = UoService.findOneByCode(code)
      if (uo) {
        uoFavorisArr.push({
          ...data,
          t_uo_code: code
        })
      }
    }

    await this.deleteUoFavoris(data, uoFavorisArr)

    return Repository.createBulk(uoFavorisArr)
  }

  static async deleteUoFavoris(data, uoFavorisArr) {
    const uoFavorisExistant = await Repository.findAll(
      0,
      0,
      't_table',
      'ASC',
      data.t_table,
      data.t_table_id,
      data.t_etablissement_code,
      true
    )
    if (
      uoFavorisExistant &&
      uoFavorisExistant.rows &&
      uoFavorisExistant.rows.length > 0
    ) {
      const uoFavorisToRemove = uoFavorisExistant.rows.filter(element => {
        for (const uoFav of uoFavorisArr) {
          if (
            uoFav.t_table === element.t_table &&
            uoFav.t_table_id === element.t_table_id &&
            uoFav.t_etablissement_code === element.t_etablissement_code &&
            uoFav.t_uo_code === element.t_uo_code
          ) {
            return false
          }
        }
        return true
      })

      await Repository.removeBulk(uoFavorisToRemove)
    }
  }

  static async validateRequest(data: any) {
    const response = uoFavorisSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findUoFavorisBy(
    user: any = null,
    codeEtablissement: string,
    table: string,
    equipeId: number = undefined
  ) {
    try {
      const uos = ['-2']
      if (equipeId && Number(equipeId) !== -1) {
        const equipe: any = await EquipeService.findOneById(equipeId)
        if (equipe) {
          uos.push(equipe.t_uo_code)
        }
      } else if (
        [
          'Super User',
          'GU',
          'Administrateur',
          'CGIE'
        ].includes(user.role.libelle))
      {
        const uosAll = await UoService.findAllByEtablissementAndDateEffect(
          codeEtablissement,
          false.toString()
        )
        uosAll.forEach((item: any) => {
          uos.push(item.get('code').toString())
        })
      } else {
        const userProperties = await UserService.getRecentUserProperties(
          user.id
        )
        uos.push(userProperties.t_uo.code)
      }

      return Repository.findUoFavorisBy(codeEtablissement, table, uos)
    } catch (err) {
      console.error(err)
    }
  }
}

export default Service
