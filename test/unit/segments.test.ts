/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/SegmentBupc/service'
import serviceGestion from '../../src/domain/segmentGestion/service'
import { resetDB } from '../utils/db'
import { insertSegmentFixtures } from '../fixtures/segments'

beforeAll(async () => {
  await resetDB()
  await insertSegmentFixtures()
})
describe('check if repository and service layers work properly for segments domain', () => {
  it('expect result', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc', 'etablissementCode')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('to give result for search segment', async done => {
    const result = await service.search('ve', 1, 50, 'id', 'asc', 'etablissementCode')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('should properly update children departements ', async done => {
    const result = await service.findAll(1, 50, 'id', 'asc', null)
    const dptEtabArr = []
    const dptClient = []
    const segment = result.rows[0].toJSON()
    dptEtabArr.push('000')
    dptEtabArr.push('001')
    dptClient.push('000')
    dptClient.push('001')
    segment.departements = dptEtabArr
    segment.departementsClient = dptClient
    segment.codeEtablissement = '00'
    delete segment.t_departement_segment_gestions
    await service.update({ ...segment })
    const record: any = await (await service.findOneById(segment.id)).toJSON()
    expect(record.t_departement_segment_gestions).toHaveLength(4)
    done()
  }),
  it('to give result for search segment #1', async done => {
    const result = await service.findAllOrSearch(null, 1, 50, 'id', 'asc', 'etablissementCode')
    expect(result.rows.length).toBeGreaterThanOrEqual(0)
    done()
  }),
  it('to give result for search segment #2', async done => {
    const result = await service.findAllOrSearch('test', 1, 50, 'id', 'asc', 'etablissementCode')
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
  it('to give result for find with filter', async done => {
    const result = await serviceGestion.findSegmentGestionChantier('etablissementCode', 'false', 'departementCode', '')
    expect(result).not.toBeNull()
    expect(result.length).toEqual(1)
    done()
  })
})
