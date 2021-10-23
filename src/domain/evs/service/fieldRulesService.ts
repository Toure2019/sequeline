import Repository from '../repository/fieldRulesRepository'
import evsSchema from '../schema/FieldRulesSchema'
import { get422Error } from '../../../util/util'

class Service {
  static findAll(choix: number, codeEtablissement: string): Promise<any> {
    return Repository.findAll(choix, codeEtablissement)
  }

  static findOneById(id: string): Promise<any> {
    return Repository.findOneByCode(id)
  }

  static update(fieldRules: any): Promise<any> {
    return Repository.update(fieldRules)
  }

  static updatePosition(fieldRules: any): Promise<any> {
    return Repository.updatePosition(fieldRules)
  }

  static add(fieldRules: any): Promise<any> {
    return Repository.add(fieldRules)
  }

  static async validateRequest(data: any) {
    const response = evsSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async setDefault(
    codeEtablissement: string,
    fieldId: string,
    grp: string
  ) {
    if (fieldId) {
      return Repository.resetField(codeEtablissement, fieldId, grp)
    } else {
      return Repository.setDefaultValues(codeEtablissement)
    }
  }
}

export default Service
