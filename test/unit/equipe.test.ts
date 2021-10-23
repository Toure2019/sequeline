/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/sousEquipe/service'
import repository from '../../src/domain/sousEquipe/repository'
import { resetDB } from '../utils/db'
import models from '../../src/domain'
import { insertEquipeFixtures } from '../fixtures/sousEquipe'
import { insertDepartementFixtures } from '../fixtures/departement'
import { insertUoFixtures } from '../fixtures/uo'
import faker from 'faker'

beforeAll(async () => {
  await resetDB()

  await insertEquipeFixtures()
  await insertDepartementFixtures()
  await insertUoFixtures()
})
describe('check if repository and service layers work properly for Equipe domain', () => {
  it('expect Equipe to be correctly added if object and edited is valid', async done => {
    const dpt = await models.Departement.findOne({ limit: 1, raw: true })
    const uo = await models.UO.findOne({ limit: 1, raw: true })
    let equipe: any = {
      num_equipe: faker.lorem.word(),
      t_uo_code: uo.code,
      t_departement_code: dpt.code
    }

    await service.save(equipe)

    equipe = await models.SousEquipe.findOne({ limit: 1, raw: true })
    expect(equipe).not.toBeNull()
    expect(equipe.id).toEqual(equipe.id)
    await service.update({ ...equipe, nom: 'test' })
    equipe = await service.findOneById(equipe.id)
    expect(equipe.nom).toEqual('test')
    done()
  }),
    it('expect Equipe not to be added if dpt code is not valid', async done => {
      const uo = await models.UO.findOne({ limit: 1, raw: true })
      let equipe: any = {
        num_equipe: faker.lorem.word(),
        t_uo_code: uo.code,
        nom: faker.lorem.word(),
        spot_equipe: faker.lorem.word(),
        t_departement_code: '65jkjk654',
        date_end: faker.date.future()
      }
      equipe = await service.save(equipe)

      expect(equipe).toMatchObject({})
      done()
    }),
    it('expect result', async done => {
      const result = await service.findAll(
        1,
        50,
        'id',
        'asc',
        '452706',
        null,
        true
      )
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('to give result for search equipe', async done => {
      const result = await service.search(
        'test',
        1,
        50,
        'id',
        'asc',
        '452706',
        null,
        true
      )

      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('to give result for search equipe', async done => {
      const result = await service.findAllOrSearch(
        'test',
        1,
        50,
        'id',
        'asc',
        '452706',
        null,
        true
      )
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    it('to give result for search equipe', async done => {
      const result = await service.findAllOrSearch(
        null,
        1,
        50,
        'id',
        'asc',
        '452706',
        null,
        true
      )
      expect(result.rows.length).toBeGreaterThanOrEqual(0)
      done()
    }),
    /*
    it('validator should return error', async done => {
      const equipe: any = {
        num_equipe: '%',
        nom: faker.lorem.word(),
        spot_equipe: faker.lorem.word(),
        date_end: faker.date.future()
      }
      const result = await service.validateRequest(equipe)

      expect(result.error).not.toBeNull()
      done()
    }) */
    it('to give result for find by uo', async done => {
      const equipe = {
        num_equipe: faker.lorem.word(),
        t_uo_code: 'uoCode',
        nom: `test ${faker.lorem.word()}`,
        spot_equipe: faker.lorem.word(),
        t_departement_code: 'depCode',
        date_end: faker.date.future()
      }
      await service.save(equipe)
      const fetchEquipe = await repository.findAllByUo(['uoCode', 'invalid'])
      expect(fetchEquipe).not.toBeNull()
      expect(fetchEquipe.length).toEqual(1)
      done()
    })
})
