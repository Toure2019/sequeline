/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import md5 from 'md5'

import User from '../../src/domain/auth/model'

export const insertUserFixtures = () => {
  const newData = []

  for (let i = 0; i < 10; i++) {
    const nom = faker.name.lastName()
    const prenom = faker.name.firstName()
    const pastDate = faker.date.past().toISOString()
    const futureDate = faker.date.future().toISOString()
    const formatedPastDate = pastDate.substr(0, pastDate.indexOf('T'))
    const formatedFutureDate = futureDate.substr(0, futureDate.indexOf('T'))

    const login = faker.random.alphaNumeric(30)

    const seedData = {
      login,
      nom,
      prenom,
      nom_complet: `${prenom} ${nom}`,
      is_superuser: faker.random.number(1),
      mail: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      password: md5(`${login}password`),
      token: faker.random.alphaNumeric(45),
      date_end_token: formatedFutureDate,
      date_create: formatedPastDate,
      enabled: faker.random.number(1),
      search: '',
      version: formatedPastDate,
      flag_type_validation: faker.random.number(1),
      t_uo_code_assistant: faker.random.alphaNumeric(45)
    }

    newData.push(seedData)
  }

  const pastDate = faker.date.past().toISOString()
  const futureDate = faker.date.future().toISOString()
  const formatedPastDate = pastDate.substr(0, pastDate.indexOf('T'))
  const formatedFutureDate = futureDate.substr(0, futureDate.indexOf('T'))

  const login = 'cp1234567890'

  const admin = {
    login,
    nom: 'admin',
    prenom: 'admin',
    nom_complet: 'admin admin',
    is_superuser: 1,
    mail: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: md5(`${login}password`),
    token: faker.random.alphaNumeric(45),
    date_end_token: formatedFutureDate,
    date_create: formatedPastDate,
    enabled: faker.random.number(1),
    search: '',
    version: formatedPastDate,
    flag_type_validation: faker.random.number(1),
    t_uo_code_assistant: faker.random.alphaNumeric(45)
  }

  newData.push(admin)

  User.bulkCreate(newData)
}
