/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertDepartementFixtures = () => {
  const rgs = []
  const deps = []

  for (let i = 0; i < 5; i++) {
    const departementCode = faker.random.uuid()

    const departement = {
      code: departementCode,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      t_rg_code: i,
      enabled: 1
    }

    const rg = {
      code: i,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 1
    }

    deps.push(departement)
    rgs.push(rg)
  }
  models.Rg.bulkCreate(rgs)
  models.Departement.bulkCreate(deps)
}
