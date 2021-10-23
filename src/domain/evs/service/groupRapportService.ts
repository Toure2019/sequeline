import Repository from '../repository/groupSettingsRapportRepository'
import groupSchema from '../schema/groupSettingsSchema'
import { get422Error } from '../../../util/util'

class Service {
  static findAll(codeEtablissement: string): Promise<any> {
    return Repository.findAll(codeEtablissement)
  }

  static findOneById(id: string): Promise<any> {
    return Repository.findOneByCode(id)
  }

  static update(fieldRules: any): Promise<any> {
    return Repository.update(fieldRules)
  }

  static add(fieldRules: any, codeEtablissement: string): Promise<any> {
    return Repository.add(fieldRules, codeEtablissement)
  }

  static delete(id: number): Promise<any> {
    return Repository.delete(id)
  }
  static async validateRequest(data: any) {
    const response = groupSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }
}

export default Service
