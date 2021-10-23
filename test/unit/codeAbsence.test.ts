/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/codeAbsence/service'
import { resetDB } from '../utils/db'
import { insertCodeAbsenceFixtures } from '../fixtures/codeAbsence'

beforeAll(async () => {
  await resetDB()
  await insertCodeAbsenceFixtures()
})
describe('check if repository and service layers work properly for CodeAbsence domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc', '0')
    expect(result.rows.length).toBeGreaterThanOrEqual(5)
    done()
  })
  it('to give result for search engin', async done => {
    const result = await service.search('ve', 1, 50, 'id', 'asc', '0')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),
    /*
  it('should properly update ', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc')
    let record = result.rows[0].toJSON()
    await service.update({ ...record, t_compte_nom: 'test' })
    record = await service.findOneByCode(record.code)
    expect(record.t_compte_nom).toEqual('test')
    done()
  }) */ it('should properly add ', async done => {
      const CODE = '12321'
      const codeAbsence = {
        code: CODE,
        t_compte_nom: 'testOne'
      }
      const addAbsence: any = await service.add(codeAbsence)
      expect(addAbsence).not.toBeNull()
      expect(addAbsence.code).toEqual(CODE)
      done()
    }),
    it('to give result for search code Absence #1', async done => {
      const result = await service.findAllOrSearch(null, 1, 50, 'id', 'asc', '0')
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('to give result for search code Absence #2', async done => {
      const result = await service.findAllOrSearch('test', 1, 50, 'id', 'asc', '0')
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('validator should return error', async done => {
      const engin: any = {
        t_compte_nom: '%'
      }
      const result = await service.validateRequest(engin)

      expect(result.error).not.toBeNull()
      done()
    })
})
