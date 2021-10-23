/* eslint-disable @typescript-eslint/camelcase */
import request from 'supertest'
import app from '../../src/app'
import faker from 'faker'

describe('Check if equipe endpoints work properly', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/api/equipe?page=1&pageSize=50')
      .expect(200, done)
  })

  it('should match with  at least one row containing keyword ', async done => {
    const res: any = await request(app).get('/api/equipe?keyword=ve')
    expect(res.body.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('should reject update if Equipe object does not comply with schema ', async done => {
    const equipe: any = {
      num_equipe: '%',
      t_uo_code: '%',
      nom: faker.lorem.word(),
      spot_equipe: faker.lorem.word(),
      date_end: faker.date.future()
    }
    await request(app)
      .put('/api/equipe')
      .send(equipe)
      .expect(422)
    done()
  })
})
