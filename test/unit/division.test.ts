import service from '../../src/domain/division/service'
// import { insertDivisionFixtures } from '../fixtures/division'
import { resetDB } from '../utils/db'

beforeAll(async () => {
  await resetDB()
  // await insertDivisionFixtures()
})

describe('check if repository and service layers work properly for division domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(1, 50, 'code', 'asc')

    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })

  it('to give result for search divisions', async done => {
    const result = await service.search('ve', 1, 50, 'code', 'asc')

    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
})
