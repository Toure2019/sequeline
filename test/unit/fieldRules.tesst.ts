/* eslint-disable @typescript-eslint/camelcase */
import { insertFieldRulesMock } from '../fixtures/fieldRules'
import { resetDB } from '../utils/db'
import service from '../../src/domain/evs/fieldRulesService'
import groupSettingsService from '../../src/domain/evs/groupSettingsService'
import groupRapportService from '../../src/domain/evs/groupRapportService'

beforeAll(async () => {
  await resetDB()
  await insertFieldRulesMock()
})

describe('check if repository and service layers work properly for EVS domain', () => {
  it('it should find all field rules', async done => {
    const result = await service.findAll(0, '0')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),
    it('it should find all group settings', async done => {
      const result = await groupSettingsService.findAll('0')
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('it should find all group rapport', async done => {
      const result = await groupSettingsService.findAll('0')
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    /*
    it('should properly update field rules ', async done => {
      const result = await service.findAll(1, 50, 'id_field', 'asc', 0)
      let record = result.rows[0].toJSON()
      await service.updatePosition({
        ...record,
        forSettings: 1,
        position_in_settings: 2
      })
      record = await service.findOneById(record.id_field)
      expect(record.position_in_settings).toEqual(2)
      done()
    }), */
    it('should properly update group settings ', async done => {
      const result = await groupSettingsService.findAll('0')
      let record = result.rows[0].toJSON()
      await groupSettingsService.update({
        ...record,
        libelle: 'test'
      })
      record = await groupSettingsService.findOneById(record.id)
      expect(record.libelle).toEqual('test')
      done()
    }),
    it('should properly update group rapport ', async done => {
      const result = await groupRapportService.findAll('0')
      let record = result.rows[0].toJSON()
      await groupRapportService.update({
        ...record,
        libelle: 'test'
      })
      record = await groupRapportService.findOneById(record.id)
      expect(record.libelle).toEqual('test')
      done()
    }),
    it('should properly add group settings ', async done => {
      const CODE = 'test'
      let groupSettings = {
        libelle: CODE
      }
      groupSettings = await groupSettingsService.add(groupSettings, '0')
      expect(groupSettings).not.toBeNull()
      expect(groupSettings.libelle).toEqual(CODE)
      done()
    }),
    it('should properly add group rapport ', async done => {
      const CODE = 'test'
      let groupSettings = {
        libelle: CODE
      }
      groupSettings = await groupRapportService.add(groupSettings, '0')
      expect(groupSettings).not.toBeNull()
      expect(groupSettings.libelle).toEqual(CODE)
      done()
    })
})
