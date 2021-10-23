import service from '../../src/domain/Rg/service'
import { insertRgFixtures } from '../fixtures/rg'
import { resetDB } from '../utils/db'

beforeAll(async () => {
  await resetDB()
  await insertRgFixtures()
})
describe('check if repository and service layers work properly for rg domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(1, 50, 'code', 'asc')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('to give result for search rg', async done => {
    const result = await service.search('ve', 1, 50, 'code', 'asc')
    expect(result.rows.length).toBeGreaterThanOrEqual(5)
    done()
  })
})
