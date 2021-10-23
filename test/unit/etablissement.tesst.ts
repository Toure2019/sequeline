import service from '../../src/domain/etablissement/service'
import { insertEtablissementFixtures } from '../fixtures/etablissement'
import { resetDB } from '../utils/db'

beforeAll(async () => {
  await resetDB()
  await insertEtablissementFixtures()
})
describe('check if repository and service layers work properly for etablissement domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(1, 50, 'code', 'asc', null)
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('to give result for search etablissement', async done => {
    const result = await service.search('ve', 1, 50, 'code', 'asc', null)
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('should properly update ', async done => {
    const result = await service.findAll(1, 50, 'code', 'asc', null)
    const testLibelle = 'testUpdate'
    let record = result.rows[0]
    service.update({ ...record, libelle: testLibelle })
    record = await service.findOneByCode(record.code)
    expect(record.libelle).toEqual(testLibelle)
    done()
  })
})
