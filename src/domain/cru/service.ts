import Repository from './repository'
import MonthPeriodSchema from './cruMonthPeriodSchema'
import { get422Error } from '../../util/util'

class Service {
  static findAll(page: number, pageSize: number, annee: number): Promise<any> {
    return Repository.findMonthPeriodForYear(page, pageSize, annee)
  }

  static update(cruMonthPeriod: any): Promise<any> {
    return Repository.update(cruMonthPeriod)
  }

  static async validateRequest(data: any) {
    const response = MonthPeriodSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneByMonthAnnee(annee: number, mois: number) {
    return Repository.findOneByMonthPeriod(annee, mois)
  }

  static async delete(annee: number, mois: number) {
    return Repository.delete({ annee, mois })
  }

  static async save(cruMonthPeriod: any) {
    return Repository.add(cruMonthPeriod)
  }
}

export default Service
