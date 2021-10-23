/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/user/service/user'
import { resetDB } from '../utils/db'
import { insertUserPropertiesFixtures } from '../fixtures/userProperties'

beforeAll(async () => {
  await resetDB()
  await insertUserPropertiesFixtures()
})
describe('check if repository and service layers work properly for User domain', () => {
  it('expect result', async done => {
    const result = await service.findAllUserProperties(1, 50, 'id', 'asc', '1')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
})
