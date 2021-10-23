/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertCodeAbsenceFixtures = async () => {
  const codeAbsences = []

  for (let i = 0; i < 10; i++) {
    const codeAbsence = {
      code: faker.random.uuid(),
      t_compte_nom: faker.lorem.word(),
      t_etablissement_code: 0,
      nom: faker.lorem.word()
    }

    codeAbsences.push(codeAbsence)
  }
  await models.CodeAbsence.bulkCreate(codeAbsences)
}
