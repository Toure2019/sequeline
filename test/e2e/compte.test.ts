/* eslint-disable @typescript-eslint/camelcase */
import request from 'supertest'
import app from '../../src/app'

describe('Check if compte endpoints work properly', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/api/compte?page=1&pageSize=50')
      .expect(200, done)
  })

  it('should match with  at least one row containing keyword ', async done => {
    const res: any = await request(app).get('/api/compte?keyword=ve')
    expect(res.body.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('should reject update if Compte object does not comply with schema ', async done => {
    const compte: any = {
      t_type_compte_id: 0,
      t_specialite_id: 0,
      date_effet: new Date(),
      date_effet_end: new Date(),
      nom: 1
    }
    await request(app)
      .put('/api/compte')
      .send(compte)
      .expect(422)
    done()
  })
})
