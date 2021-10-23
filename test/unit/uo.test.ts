/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/uo/service'
import { insertUoFixtures } from '../fixtures/uo'
import { resetDB } from '../utils/db'
import UO from '../../src/domain/uo/models/uo'
import faker from 'faker'

beforeAll(async () => {
  await resetDB()
  await insertUoFixtures()
})
describe('check if repository and service layers work properly for uo domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(
      1,
      50,
      'code',
      'asc',
      'test',
      true,
      '452706'
    )
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('to give result for search uo', async done => {
    const result = await service.search('ve', 1, 50, 'code', 'asc', 'CP', '0')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),
  it('to give result for find by etablissement', async done => {
    const uoEnabled = {
      code: 6, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_uo_code_parent: faker.random.uuid(),
      date_effet_parent: faker.date.past(),
      date_active: faker.date.past(),
      date_effet_departement: faker.date.future().toString(),
      t_type_uo_code: 1,
      date_effet_etablissement: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 1,
      t_etablissement_code: 'etablissementCode',
    }

    UO.create(uoEnabled)
  
    const uoDisabled = {
      code: 7, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      t_uo_code_parent: faker.random.uuid(),
      date_effet_parent: faker.date.past(),
      date_active: faker.date.past(),
      date_effet_departement: faker.date.future().toString(),
      t_type_uo_code: 1,
      date_effet_etablissement: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 0,
      t_etablissement_code: 'etablissementCode',
    }
    UO.create(uoDisabled)

    const uoPast = {
      code: 8, //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.past(),
      t_uo_code_parent: faker.random.uuid(),
      date_effet_parent: faker.date.past(),
      date_active: faker.date.past(),
      date_effet_departement: faker.date.future().toString(),
      t_type_uo_code: 1,
      date_effet_etablissement: faker.date.future(),
      libelle: `ve ${faker.lorem.word()}`,
      libelle_min: faker.lorem.word(),
      enabled: 0,
      t_etablissement_code: 'etablissementCode',
    }
    UO.create(uoPast)
    let result = await service.findAllByEtablissementAndDateEffect('etablissementCode', 'false')
    expect(result).not.toBeNull()
    expect(result.length).toEqual(1)
    result = await service.findAllByEtablissementAndDateEffect('etablissementCode', 'true')
    expect(result).not.toBeNull()
    expect(result.length).toEqual(2)
    result = await service.findAllByEtablissementAndDateEffect('invalid', 'true')
    expect(result).not.toBeNull()
    expect(result.length).toEqual(0)
    done()
  })
})
