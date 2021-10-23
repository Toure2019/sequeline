/* eslint-disable @typescript-eslint/camelcase */
import paginate from '../../util/database'
import models from '..'
import logger from '../../util/logger'

class Repository {
  static async findMonthPeriodForYear(
    page: number,
    pageSize: number,
    annee: number
  ): Promise<any> {
    let result: any
    try {
      result = await models.CruMonthPeriod.findAndCountAll({
        where: {
          annee: annee
        },
        raw: false,
        nest: true,

        ...paginate(page, pageSize)
      })
    } catch (err) {
      logger.debug(err.message)
    }

    return {
      ...result,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static async update(cruMonthPeriod: any) {
    const period = await this.findOneByMonthPeriod(
      cruMonthPeriod.annee,
      cruMonthPeriod.mois
    )
    if (period) {
      let value = JSON.parse(period.num_semaines)
      if (cruMonthPeriod.active) {
        value.push(cruMonthPeriod.num_semaine.toString())
      } else {
        value = value.filter(x => x != cruMonthPeriod.num_semaine)
      }

      cruMonthPeriod.num_semaines = JSON.stringify(value)
      return models.CruMonthPeriod.update(cruMonthPeriod, {
        where: { annee: cruMonthPeriod.annee, mois: cruMonthPeriod.mois }
      })
    } else {
      return models.CruMonthPeriod.create({
        annee: cruMonthPeriod.annee,
        mois: cruMonthPeriod.mois,
        num_semaines: JSON.stringify([cruMonthPeriod.num_semaine.toString()])
      })
    }
  }

  static async delete(cruMonthPeriod: any) {
    return models.CruMonthPeriod.destroy({
      where: { annee: cruMonthPeriod.annee, mois: cruMonthPeriod.mois }
    })
  }

  static async add(cruMonthPeriod: any) {
    return models.CruMonthPeriod.create(cruMonthPeriod)
  }

  static async findOneByMonthPeriod(annee: number, mois: number) {
    const result = models.CruMonthPeriod.findOne({
      raw: true,
      where: { annee, mois }
    })
    return result
  }
}

export default Repository
