/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertEtablissementFixtures = () => {
  const newData = []
  for (let i = 0; i < 5; i++) {
    const seedData = {
      code: i, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_type_etablissement_code: faker.random.uuid(),
      t_categorie_etablissement_code: faker.random.uuid(),
      date_start: faker.date.past(),
      date_end: faker.date.future(),
      libelle: faker.lorem.word(),
      libelle_min: faker.lorem.word(),
      enabled: 1
    }
    newData.push(seedData)
  }

  for (let i = 5; i < 10; i++) {
    const seedData = {
      code: faker.random.uuid(), //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_type_etablissement_code: faker.random.uuid(),
      t_categorie_etablissement_code: faker.random.uuid(),
      date_start: faker.date.past(),
      date_end: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 1
    }

    newData.push(seedData)
  }

  // Etablissement Data
  const etablissementData = []
  for (let i = 0; i < 10; i++) {
    const seedData = {
      key: i,
      t_etablissement_code: i,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      value: faker.lorem.word()
    }
    etablissementData.push(seedData)
  }

  models.Etablissement.bulkCreate(newData)
  models.EtablissementData.bulkCreate(etablissementData)
}
