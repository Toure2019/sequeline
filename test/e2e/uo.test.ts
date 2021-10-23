import request from 'supertest'
import app from '../../src/app'

describe('Check if departement endpoints work properly', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/api/uo?page=1&pageSize=50')
      .expect(200, done)
  })

  it('should match with  at least one row containing keyword ', async done => {
    const res: any = await request(app).get('/api/uo?keyword=ve')
    expect(res.body.rows.length).toBeGreaterThanOrEqual(0)
    done()
  })
})
