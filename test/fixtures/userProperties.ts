/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import md5 from 'md5'

import User from '../../src/domain/auth/model'
import UserProperties from '../../src/domain/user/models/userProperties'
import EmploiReperes from '../../src/domain/EmploiRepere/model'

export const insertUserPropertiesFixtures = () => {
  const pastDate = faker.date.past().toISOString()
  const futureDate = faker.date.future().toISOString()
  const recentDate = faker.date.recent().toISOString()
  const formatedPastDate = pastDate.substr(0, pastDate.indexOf('T'))
  const formatedFutureDate = futureDate.substr(0, futureDate.indexOf('T'))
  const formatedRecentDate = futureDate.substr(0, recentDate.indexOf('T'))

  // Create User
  const userData = []

  const user = {
    id: 1,
    login: 'cp123',
    nom: 'admin',
    prenom: 'admin',
    nom_complet: 'admin admin',
    is_superuser: 1,
    mail: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: md5('password'),
    token: faker.random.alphaNumeric(45),
    date_end_token: formatedFutureDate,
    date_create: formatedPastDate,
    enabled: faker.random.number(1),
    search: '',
    version: formatedPastDate,
    flag_type_validation: faker.random.number(1),
    t_uo_code_assistant: faker.random.alphaNumeric(45)
  }

  userData.push(user)

  User.bulkCreate(userData)

  // EmploiRepere
  const emploiRepereData = [
    {
      code: '123',
      libelle: faker.lorem.word(),
      libelle_min: faker.lorem.word()
    }
  ]
  EmploiReperes.bulkCreate(emploiRepereData, {
    ignoreDuplicates: true
  })

  // Create User Properties
  const userPropertiesData = []

  const userProperties1 = {
    date_affectation: formatedPastDate,
    date_cessation_activite: formatedPastDate,
    t_uo_code: '123',
    t_emploi_repere_code: '123',
    t_dimension_manageriale_code: '123',
    t_departement_code: '123',
    t_user_login_manager: null,
    code_poste: '123',
    t_uo_code_compare: '123',
    t_emploi_repere_code_compare: '123',
    t_dimension_manageriale_code_compare: '123',
    date_effet: formatedPastDate,
    date_effet_end: formatedPastDate,
    t_user_id: 1
  }

  const userProperties2 = {
    date_affectation: formatedRecentDate,
    date_cessation_activite: formatedRecentDate,
    t_uo_code: '123',
    t_emploi_repere_code: '123',
    t_dimension_manageriale_code: '123',
    t_departement_code: '123',
    t_user_login_manager: null,
    code_poste: '123',
    t_uo_code_compare: '123',
    t_emploi_repere_code_compare: '123',
    t_dimension_manageriale_code_compare: '123',
    date_effet: formatedRecentDate,
    date_effet_end: formatedFutureDate,
    t_user_id: 1
  }

  userPropertiesData.push(userProperties1)
  userPropertiesData.push(userProperties2)

  UserProperties.bulkCreate(userPropertiesData)
}
