/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/uoFavoris/service'
import { resetDB } from '../utils/db'
import models from '../../src/domain'
import { insertDepartementFixtures } from '../fixtures/departement'
import { insertEtablissementFixtures } from '../fixtures/etablissement'
import { insertUoFixtures } from '../fixtures/uo'
import { insertEnginFixtures } from '../fixtures/engin'

beforeAll(async () => {
  await resetDB()
  await insertDepartementFixtures()
  await insertEnginFixtures()
  await insertEtablissementFixtures()
  await insertUoFixtures()
})
describe('check if repository and service layers work properly for uo Favoris domain', () => {
  it('expect Favorite Uo to be correctly added if object is valid', async done => {
    const dpt = await models.Departement.findOne({ limit: 1, raw: true })
    let uos = await models.UO.findAll({ limit: 2, raw: true })
    uos = uos.map((item: any) => item.code)
    const etab = await models.Etablissement.findOne({ limit: 1, raw: true })
    const favoriteUo = {
      t_table: 't_departement',
      t_table_id: dpt.code,
      t_etablissement_code: etab.code,
      uos: uos
    }
    await service.create(favoriteUo)
    const fav = await models.UoFavoris.findOne({ limit: 1, raw: true })
    expect(fav).not.toBeNull()
    expect(fav.t_table_id).toEqual(dpt.code)
    done()
  }),
  it('expect Favorite Uo not to be added if dpt code is not valid', async done => {
    let uos = await models.UO.findAll({ limit: 2, raw: true })
    const etab = await models.Etablissement.findOne({ limit: 1, raw: true })
    uos = uos.map((item: any) => item.code)
    const favoriteUo = {
      t_table: 't_departement',
      t_table_id: 'jklkjl',
      t_etablissement_code: etab.code,
      uos: uos
    }
    expect(service.create(favoriteUo)).toMatchObject({})
    const fav = await models.UoFavoris.findOne({
      where: favoriteUo,
      raw: true
    })
    expect(fav).not.toBeTruthy()
    done()
  }),
  it('to give result for uo favori by etablissement and table', async done => {
    const dpt = await models.Departement.findOne({ limit: 1, raw: true })
    const engin = await models.Engin.findOne({ limit: 1, raw: true })
    let uos = await models.UO.findAll({ limit: 2, raw: true })
    const codeEtab = uos[0].t_etablissement_code
    uos = uos.map((item: any) => item.code)
    const favoriteUoDepartement = {
      t_table: 't_departement',
      t_table_id: dpt.code,
      t_etablissement_code: codeEtab,
      uos: uos
    }
    const favoriteUoEngin = {
      t_table: 't_engin',
      t_table_id: engin.id,
      t_etablissement_code: codeEtab,
      uos: uos
    }
    const user = {
      id: 1,
      role: {id: 1, libelle: 'Super User'}
    }
    await service.create(favoriteUoDepartement)
    await service.create(favoriteUoEngin)
    const resultDepartement = await service.findUoFavorisBy(user, codeEtab, 't_departement')
    expect(resultDepartement).not.toBeNull()
    expect(resultDepartement.length).toEqual(1)
    const resultEngin = await service.findUoFavorisBy(user, codeEtab, 't_engin')
    expect(resultEngin).not.toBeNull()
    expect(resultEngin.length).toEqual(1)
    const resultEnginInvalidEtab = await service.findUoFavorisBy(user, 'invalid', 't_engin')
    expect(resultEnginInvalidEtab).not.toBeNull()
    expect(resultEnginInvalidEtab.length).toEqual(0)
    done()
  })
})
