/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/user/service/user'
import { resetDB } from '../utils/db'
import { insertUserFixtures } from '../fixtures/user'
import { UserInterface } from '../../src/domain/user/interfaces/user'

beforeAll(async () => {
  await resetDB()
  await insertUserFixtures()
})
describe('check if repository and service layers work properly for User domain', () => {
  /*
  it('expect Equipe to be correctly added if object and edited is valid', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc')
    const record = result.rows[0]
    expect(record).not.toBeNull()
    await service.update({ ...record.toJSON(), nom: 'test' })
    const user: any = await service.findOneById(record.id)
    expect(user.nom).toEqual('test')
    done()
  }),*/
  it('expect result', async done => {
    const result = await service.findAll('', 1, 50, 'id', 'asc', null, 0, 0)
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),
    /*
    it('to give result for search utilisateur #1', async done => {
      const result = await service.search('test', 1, 50, 'id', 'asc', null, 0)
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('to give result for search utilisateur #2', async done => {
      const result = await service.findAllOrSearch(
        'test',
        1,
        50,
        'id',
        'asc',
        null,
        0
      )
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }), */
    it('to give result for search utilisateur #3', async done => {
      const result = await service.findAllOrSearch(
        null,
        1,
        50,
        'id',
        'asc',
        null,
        0,
        0
      )
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('User validator should return error', async done => {
      const user: any = {
        code: '%'
      }
      const result = await service.validateRequest(user)

      expect(result.error).not.toBeNull()
      done()
    })
}),

describe('check User update', () => {
  const data = [
    { user: {userId: '2', phone: '1234567890', mail: 'test@asr.fr'} as UserInterface, expected: 1},
    { user: {userId: '', phone: '1234567890', mail: 'test@asr.fr'} as UserInterface, expected: 0}
  ]

  test.each(data)(
    'given user object, expect valid result',
    async ({user, expected}) => {
      const result = await service.updateUser(user)
      expect(result[0]).toStrictEqual(expected)
    }
  )
})
