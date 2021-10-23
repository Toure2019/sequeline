/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertUoFixtures = () => {
  const uos = []
  const typeUos = []
  const niveauUos = []

  for (let i = 0; i < 5; i++) {
    const uoCode = faker.random.uuid()
    const typeUoCode = faker.random.uuid()
    const niveauUoCode = faker.random.uuid()

    const uoTypeObj = {
      code: typeUoCode, //numéro
      t_niveau_uo_code: niveauUoCode,
      libelle: faker.random.uuid(),
      libelle_min: faker.random.uuid()
    }

    const niveauTypeObj = {
      code: niveauUoCode, //numéro 
      libelle: faker.random.uuid(),
      libelle_min: faker.random.uuid()
    }

    const uoObj = {
      code: uoCode, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_uo_code_parent: faker.random.uuid(),
      date_effet_parent: faker.date.past(),
      date_active: faker.date.past(),
      date_effet_departement: faker.date.future(),
      t_type_uo_code: typeUoCode,
      date_effet_etablissement: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 1,
      t_etablissement_code: faker.random.uuid(),
    }

    niveauUos.push(niveauTypeObj)
    typeUos.push(uoTypeObj)
    uos.push(uoObj)
  }

  models.NiveauUo.bulkCreate(niveauUos)
  models.TypeUo.bulkCreate(typeUos)
  models.UO.bulkCreate(uos)
}
