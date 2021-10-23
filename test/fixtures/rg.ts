/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertRgFixtures = () => {
  const rgs = []
  const divs = []

  for (let i = 0; i < 5; i++) {
    const rgCode = faker.random.uuid()
    const divisionCode = faker.random.uuid()

    const rg = {
      code: rgCode, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_division_code: divisionCode,
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 1
    }

    const division = {
      code: divisionCode, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      libelle: faker.lorem.word(),
      libelle_min: faker.lorem.word(),
      t_bugl_code: faker.random.uuid(),
      enabled: 1
    }

    divs.push(division)
    rgs.push(rg)
  }
  models.Division.bulkCreate(divs)
  models.Rg.bulkCreate(rgs)
}
