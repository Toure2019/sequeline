/* eslint-disable @typescript-eslint/camelcase */
import models from '../../src/domain'

export const insertMonthPeriodFixtures = async () => {
  const newData = []
  const obj = {
    annee: 2020,
    mois: 12,
    num_semaines: '1,2,3'
  }

  newData.push(obj)
  await models.CruMonthPeriod.bulkCreate(newData)
}
