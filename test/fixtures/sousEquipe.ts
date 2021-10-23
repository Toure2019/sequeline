/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertEquipeFixtures = () => {
  const equipes = []

  for (let i = 0; i < 5; i++) {
    const uoCode = faker.random.uuid()
    const depCode = faker.random.uuid()

    const equipe = {
      id: i,
      num_equipe: faker.lorem.word(),
      t_uo_code: uoCode,
      nom: `test ${faker.lorem.word()}`,
      spot_equipe: faker.lorem.word(),
      t_departement_code: depCode,
      date_end: faker.date.future(),
      
    }

    equipes.push(equipe)
  }
  models.SousEquipe.bulkCreate(equipes)
}
