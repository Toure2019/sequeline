/* eslint-disable @typescript-eslint/camelcase */
import { insertMonthPeriodFixtures } from '../fixtures/monthPeriod'
import { resetDB } from '../utils/db'
import service from '../../src/domain/cru/service'

beforeAll(async () => {
  await resetDB()
  await insertMonthPeriodFixtures()
})

describe('check if repository and service layers work properly for MonthPeriod domain', () => {
  it('it should find all', async done => {
    const result = await service.findAll(1, 50, 2020)
    expect(result.rows.length).toBeGreaterThanOrEqual(1)
    done()
  }),
    /*
    it('should properly update ', async done => {
      let result = await service.findAll(1, 50, 2020)
      let record = result.rows[0].toJSON()
      await service.update({ ...record, num_semaines: '1,2' })
      result = await service.findAll(1, 50, 2020)
      record = result.rows[0].toJSON()
      expect(record.num_semaines).toEqual('1,2')
      done()
    }), */
    it('should properly delete ', async done => {
      let result = await service.findAll(1, 50, 2020)
      const record = result.rows[0].toJSON()
      await service.delete(record.annee, record.mois)
      result = await service.findAll(1, 50, 2020)
      expect(result.rows.length).toEqual(0)
      done()
    }),
    it('should properly add ', async done => {
      const monthPeriod = {
        annee: 2020,
        mois: 10,
        num_semaines: '1,2,3'
      }
      const addMonthPeriod = await service.save(monthPeriod)
      expect(addMonthPeriod).not.toBeNull()
      expect(addMonthPeriod.mois).toEqual(10)
      done()
    })
})
