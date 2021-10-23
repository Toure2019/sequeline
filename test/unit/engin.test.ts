import service from '../../src/domain/engin/service'
import repository from '../../src/domain/engin/repository'
import { resetDB } from '../utils/db'
import { insertEnginFixtures } from '../fixtures/engin'

beforeAll(async () => {
  await resetDB()
  await insertEnginFixtures()
})
describe('check if repository and service layers work properly for engin domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('to give result for search engin', async done => {
    const result = await service.search('ve', 1, 50, 'id', 'asc')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('should properly update ', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc')
    let record = result.rows[0].toJSON()
    await service.update({ ...record, statut: 0 })
    record = await service.findOneById(record.id)
    expect(record.statut).toEqual(0)
    done()
  }),
    it('should properly delete ', async done => {
      const result = await service.findAll(1, 50, 'id', 'asc')
      let record = result.rows[0].toJSON()
      await service.delete(record.id)
      record = await service.findOneById(record.id)
      expect(record).toBeNull()
      done()
    }),
    it('should properly add ', async done => {
      const CODE = '12321'
      const engin = {
        code: '12321',
        statut: 1,
        unite: 1
      }
      const addEngin = await service.save(engin)
      expect(addEngin).not.toBeNull()
      expect(engin.code).toEqual(CODE)
      done()
    }),
    it('to give result for search engin #1', async done => {
      const result = await service.findAllOrSearch(null, 1, 50, 'id', 'asc')
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('to give result for search engin #2', async done => {
      const result = await service.findAllOrSearch('test', 1, 50, 'id', 'asc')
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('validator should return error', async done => {
      const engin: any = {
        nom: '%'
      }
      const result = await service.validateRequest(engin)

      expect(result.error).not.toBeNull()
      done()
    }),
    it('should return engin by filter', async done => {
      const engin = {
        id: 10,
        libelle: 'engin 1',
        code: '12421',
        statut: 0,
        unite: 1
      }
      const engin2 = {
        id: 11,
        libelle: 'engin 2',
        code: '12421',
        statut: 0,
        unite: 1
      }
      const engin3 = {
        id: 12,
        libelle: 'engin 3',
        code: '12421',
        statut: 1,
        unite: 1
      }

      const temoin = await repository.findByFilter('false', false, [])
      await service.save(engin)
      await service.save(engin2)
      await service.save(engin3)

      let result = await repository.findByFilter('false', false, [])
      expect(result.length).toEqual(temoin.length + 1)

      result = await repository.findByFilter('true', false, [])
      expect(result.length).toEqual(temoin.length + 3)

      result = await repository.findByFilter('false', true, [10])
      expect(result.length).toEqual(0)

      result = await repository.findByFilter('true', true, [10, 11])
      expect(result.length).toEqual(2)

      done()
    }),
    it('to give result without favori', async done => {
      const user = {
        id: 1,
        roles: [{id: 1, libelle: 'Super User'}]
      }
      const result = await service.findByFilter(user, null, null, null)
      expect(result).not.toBeNull()
      expect(result.length).toEqual(6)
      done()
    })
})
