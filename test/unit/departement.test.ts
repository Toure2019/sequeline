import service from '../../src/domain/departement/service'
import { insertDepartementFixtures } from '../fixtures/departement'
import { resetDB } from '../utils/db'

beforeAll(async () => {
  await resetDB()
  await insertDepartementFixtures()
})
describe('check if repository and service layers work properly for departements domain', () => {
  // SQLITE DOES NOT SUPPORT FULL JOIN USED IN FINDALL QUERY

  // it('expect result', async done => {
  //   const result = await service.findAll('', 1, 50, 'code', 'asc')

  //   expect(result.rows.length).toBeGreaterThanOrEqual(0)
  //   done()
  // }),
  //   it('to give result for search departement', async done => {
  //     const result = await service.findAll('ve', 1, 50, 'code', 'asc')
  //     expect(result.rows.length).toBeGreaterThanOrEqual(5)
  //     done()
  //   }),
  it('to give result without favori', async done => {
    const user = {
      id: 1,
      roles: [{ id: 1, libelle: 'Super User' }]
    }
    const result = await service.findByFilter(user, null, 'false')
    expect(result).not.toBeNull()
    expect(result.length).toEqual(5)
    done()
  })
})
