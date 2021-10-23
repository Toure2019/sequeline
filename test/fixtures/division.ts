/* eslint-disable @typescript-eslint/camelcase */

import faker from 'faker'
import models from '../../src/domain'

export const insertDivisionFixtures = async () => {
  const newData = []
  const buglCode = faker.random.uuid()
  const bugl = {
    code: buglCode, //numéro
    libelle: `ve ${faker.lorem.word()}`,
    libelle_min: faker.lorem.word(),
    enabled: 1
  }

  await models.Bugl.create(bugl)

  for (let i = 0; i < 100; i++) {
    const seedData = {
      code: `ve ${faker.random.uuid()}`, //numéro
      libelle: faker.lorem.word(),
      date_effet: faker.date.past(),
      t_bugl_code: buglCode,
      date_effet_end: faker.date.future(),
      libelle_min: faker.lorem.word(),
      enabled: 1
    }
    newData.push(seedData)
  }
  for (let i = 0; i < 100; i++) {
    const seedData = {
      code: faker.random.uuid(), //numéro
      libelle: `ve ${faker.lorem.word()}`,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_bugl_code: buglCode,
      libelle_min: faker.lorem.word(),
      enabled: 1
    }
    newData.push(seedData)
  }
  await models.Division.bulkCreate(newData)
}
