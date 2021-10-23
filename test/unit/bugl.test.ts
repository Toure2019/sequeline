import { insertBuglFixtures } from '../fixtures/bugl'
import { resetDB } from '../utils/db'
import service from '../../src/domain/bugl/service'

beforeAll(async () => {
  await resetDB()
  await insertBuglFixtures()
})

describe('check if repository and service layers work properly for BUGL domain', () => {
  it('it should find all', async done => {
    const result = await service.findAll(1, 50, 'code', 'asc')
    expect(result.rows.length).toBeGreaterThanOrEqual(10)
    done()
  })

  it('to give result for search', async done => {
    const result = await service.search('ve', 1, 50, 'code', 'asc')
    expect(result.rows.length).toBeGreaterThanOrEqual(5)
    done()
  })
})
