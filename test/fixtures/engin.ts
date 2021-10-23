/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertEnginFixtures = () => {
  const engins = []

  for (let i = 0; i < 5; i++) {
    const enginCode = faker.random.uuid()

    const engin = {
      code: enginCode, //numéro
      unite: 1,
      statut: 1
    }

    engins.push(engin)
  }
  models.Engin.bulkCreate(engins)
}
