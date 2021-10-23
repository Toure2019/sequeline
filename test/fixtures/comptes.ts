/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import Compte from '../../src/domain/compte/model/compte'
import CompteAccessible from '../../src/domain/compte/model/compteAccessible'
import TypeCompte from '../../src/domain/typeCompte/models/typeCompte'
import Specialite from '../../src/domain/specialite/models/specialite'

export const insertCompteFixtures = () => {
  const comptes = []
  const types = []
  const specialites = []

  for (let i = 0; i < 10; i++) {
    const nom = faker.name.lastName()
    const designation = faker.name.firstName()
    const activite = faker.company.catchPhrase()
    const projet = faker.company.catchPhrase()
    const pc = faker.commerce.product()
    const code_uop = faker.random.alphaNumeric()
    const typeCompte = {
      id: i,
      name: faker.commerce.productName()
    }
    const specialite = {
      id: i,
      name: faker.commerce.productName()
    }

    const compte = {
      id: i,
      t_type_compte_id: i,
      t_specialite_id: 0,
      date_effet: faker.date.future(),
      date_effet_end: faker.date.future(),
      nom,
      designation,
      activite,
      projet,
      pc,
      code_uop,
      localisable: i === 1 ? 1 : 0,
      no_productif: 0,
      t_etablissement_code: 'codeEtablissement'
    }

    comptes.push(compte)
    types.push(typeCompte)
    specialites.push(specialite)
  }

  const compteAccessible = {
    bupc: 'bupc',
    projet: 'projet',
    activite: 'activite',
    t_rg_code: 'rgCode',
    date_effet: faker.date.past(),
    date_effet_end: faker.date.future(),
  }

  CompteAccessible.create(compteAccessible)

  Specialite.bulkCreate(specialites)
  TypeCompte.bulkCreate(types)
  Compte.bulkCreate(comptes)
}
