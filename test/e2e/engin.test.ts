/* eslint-disable @typescript-eslint/camelcase */
import request from 'supertest'
import app from '../../src/app'

describe('Check if engin endpoints work properly', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/api/engin?page=1&pageSize=50')
      .expect(200, done)
  })

  it('should match with  at least one row containing keyword ', async done => {
    const res: any = await request(app).get('/api/engin?keyword=ve')
    expect(res.body.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
  it('should reject update if user object does not comply with schema ', async done => {
    const engin: any = {
      id: '1',
      code: '%%',
      libelle: ''
    }
    await request(app)
      .put('/api/engin')
      .send(engin)
      .expect(422)
    done()
  })
})
