/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/compte/service'
import serviceSpecialite from '../../src/domain/specialite/service'
import serviceTypeCompte from '../../src/domain/typeCompte/service'
import { resetDB } from '../utils/db'
import { insertCompteFixtures } from '../fixtures/comptes'
import { insertSpecialiteFixtures } from '../fixtures/specialite'
import { insertTypeCompteFixtures } from '../fixtures/typeCompte'
import faker from 'faker'
import CompteErp from '../../src/domain/compte/model/compteErp'
import { DATEFORMAT, now } from '../../src/util/util'

beforeAll(async () => {
  await resetDB()

  await insertSpecialiteFixtures()
  await insertTypeCompteFixtures()
  await insertCompteFixtures()
})
describe('check if repository and service layers work properly for Compte domain', () => {
  it('expect compte to be correctly added if object and edited is valid', async done => {
    let compte: any = {
      t_type_compte_id: 0,
      t_specialite_id: 0,
      date_effet: new Date(),
      date_effet_end: new Date(),
      nom: 'test'
    }

    const res = await service.save(compte)
    const resultRaw = res.toJSON()
    compte = await service.findOneById(resultRaw.id)
    compte = compte.toJSON()
    expect(compte).not.toBeNull()
    expect(compte.nom).toEqual('test')
    await service.update({ ...compte, nom: 'test1' })
    compte = await service.findOneById(compte.id)
    compte = compte.toJSON()
    expect(compte.nom).toEqual('test1')
    done()
  })
  /*it('expect result', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc', true, 'codeEtablissement', 'false', false)
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),
  it('to give result for search compte', async done => {
    const result = await service.findAllOrSearch(
      null,
      1,
      50,
      'id',
      'asc',
      'true',
      'codeEtablissement',
      'false',
      false
    )
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),*/
  it('validator should return error', async done => {
    const compte: any = {
      nom: 1
    }
    const result = await service.validateRequest(compte)

    expect(result.error).not.toBeNull()
    done()
  })
})

describe('check get function for chantier', () => {
  it('to give result for get specialite', async done => {
    const result = await serviceSpecialite.findAll()
    expect(result).not.toBeNull()
    expect(result.length).toEqual(13)
    done()
  }),
  it('to give result for get type compte', async done => {
    const result = await serviceTypeCompte.findAll()
    expect(result).not.toBeNull()
    expect(result.length).toEqual(10)
    done()
  }),
  it('to give result for compte localisable', async done => {
    const localisable = await service.isCompteLocalisable(1)
    expect(localisable).toEqual(true)
    const nonLocalisable = await service.isCompteLocalisable(2)
    expect(nonLocalisable).toEqual(false)
    done()
  }),
  it('to give result for compte accessible', async done => {
    const dateNow = now(DATEFORMAT)
    const accessible = await service.existCompteAccessible('bupc', 'projet', 'activite', dateNow)
    expect(accessible).toBeTruthy()
    const nonAccessible = await service.existCompteAccessible('invalid', 'projet', 'activite', dateNow)
    expect(nonAccessible).not.toBeTruthy()
    done()
  }),
  it('to give result for compte erp', async done => {
    const compteErp = {
      bupc: 'bupc',
      projet: 'projet',
      activite: 'activite',
      t_rg_code: 'rgCode',
      ecc: faker.random.uuid(),
      projet_statut: 1,
      activite_statut: 1,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
    }
    CompteErp.create(compteErp)
    const compteErpProjetInactif = {
      bupc: 'bupc2',
      projet: 'projet',
      activite: 'activite',
      t_rg_code: 'rgCode',
      ecc: faker.random.uuid(),
      projet_statut: 0,
      activite_statut: 1,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
    }
    CompteErp.create(compteErpProjetInactif)
    const compteErpInactif = {
      bupc: 'bupc3',
      projet: 'projet',
      activite: 'activite',
      t_rg_code: 'rgCode',
      ecc: faker.random.uuid(),
      projet_statut: 1,
      activite_statut: 0,
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
    }
    const dateNow = now(DATEFORMAT)
    CompteErp.create(compteErpInactif)
    const erp = await service.findCompteErpBy('bupc', 'projet', 'activite', dateNow)
    expect(erp).toBeTruthy()
    const erpInvalid = await service.findCompteErpBy('invalid', 'projet', 'activite', dateNow)
    expect(erpInvalid).not.toBeTruthy()
    const erpProjetInactif = await service.findCompteErpBy('bupc2', 'projet', 'activite', dateNow)
    expect(erpProjetInactif).not.toBeTruthy()
    const erpInactif = await service.findCompteErpBy('bupc3', 'projet', 'activite', dateNow)
    expect(erpInactif).not.toBeTruthy()
    done()
  })
})
