import request from 'supertest'
import app from '../../../src/app'

describe('e2e - Auth - login', () => {
  it('should return 422 when a field is missing', async done => {
    const res: any = await request(app)
      .post('/api/auth/login')
      .send({ login: 'john' })

    expect(res.statusCode).toEqual(422)
    done()
  })

  it('should return 401 when credentials are wrong', async done => {
    const res: any = await request(app)
      .post('/api/auth/login')
      .send({ login: 'john', password: 'yusdgsj' })

    expect(res.statusCode).toEqual(401)
    done()
  })

  it('should return 200 OK if good credenials', async done => {
    const res: any = await request(app)
      .post('/api/auth/login')
      .send({ login: 'cp1234567890', password: 'password' })

    expect(res.statusCode).toEqual(200)

    done()
  })
})
