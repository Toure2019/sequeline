/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertBuglFixtures = async () => {
  const newData = []
  for (let i = 0; i < 52; i++) {
    const seedData = {
      code: `ve ${faker.random.uuid()}`, //numéro
      libelle: faker.lorem.word(),
      libelle_min: faker.lorem.word(),
      enabled: 1
    }
    newData.push(seedData)
  }
  for (let i = 0; i < 52; i++) {
    const seedData = {
      code: faker.random.uuid(), //numéro
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 1
    }
    newData.push(seedData)
  }
  await models.Bugl.bulkCreate(newData)
}
