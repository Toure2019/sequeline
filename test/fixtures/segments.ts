/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertSegmentFixtures = () => {
  const segmentBupcArr = []
  const SegmentBupcDepartementArr = []
  const SegmentGestionArr = []
  const codeEtablissement = '00'
  for (let i = 0; i < 100; i++) {
    const segmentId = i
    const bupc = {
      t_segment_gestion_id: segmentId,
      bupc: faker.name.firstName(), //numéro
      date_effet: faker.date.past(),
      date_effet_end: faker.date.future(),
      enabled: 1
    }

    const segment = {
      id: segmentId,
      code: faker.random.uuid(), //numéro
      nom: faker.name.jobDescriptor()
    }

    const segmentDepartement = {
      t_segment_gestion_id: segmentId,
      t_departement_code: faker.random.uuid(),
      t_etablissement_code: codeEtablissement,
      to_client: 1
    }

    segmentBupcArr.push(bupc)
    SegmentBupcDepartementArr.push(segmentDepartement)
    SegmentGestionArr.push(segment)
  }

  const segmentBupcDepartement = {
    t_segment_gestion_id: 101,
    t_departement_code: 'departementCode',
    t_etablissement_code: 'etablissementCode',
    to_client: 0
  }

  const segmentGestion = {
    id: 101,
    code: faker.random.uuid(), //numéro
    nom: faker.name.jobDescriptor(),
    visible: 1
  }

  SegmentGestionArr.push(segmentGestion)
  SegmentBupcDepartementArr.push(segmentBupcDepartement)

  models.DepartementSegmentGestion.bulkCreate(SegmentBupcDepartementArr)
  models.SegmentBUPC.bulkCreate(segmentBupcArr)
  models.SegmentGestion.bulkCreate(SegmentGestionArr)
}
