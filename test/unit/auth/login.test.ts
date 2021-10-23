import chai from 'chai'
// import jwt from 'jsonwebtoken'

import { insertUserFixtures } from '../../fixtures/user'
import User from '../../../src/domain/auth/model'
import { resetDB } from '../../utils/db'
import schema from '../../../src/domain/auth/loginSchema'
import repository from '../../../src/domain/auth/repository'
import service from '../../../src/domain/auth/service'

const expect = chai.expect

beforeAll(async () => {
  await resetDB()
  await insertUserFixtures()
})

describe('Auth - login - schema', () => {
  it('should validate the a correct login and password', async () => {
    const user: any = await User.findOne({ raw: true })

    const data = { login: user.login, password: 'password' }

    const { error, value } = schema.validate(data)

    expect(error).to.be.undefined
    expect(value).to.eql(data)
  })

  it('should return an error with some bad data sent to the validator', async () => {
    const data = [
      {
        data: {},
        response: 'Veuillez indiquer votre identifiant'
      },

      { data: { login: 'aaaaaa' }, response: 'Veuillez indiquer votre mot de passe' },
      { data: { password: 'aaaaaa' }, response: 'Veuillez indiquer votre identifiant' },

      {
        data: { login: 'aaaaaa', password: '' },
        response: 'Veuillez indiquer votre mot de passe'
      },
      {
        data: { login: '', password: 'aaaaaa' },
        response: 'Veuillez indiquer votre identifiant'
      },

      {
        data: {
          login: 'aa'
        },
        response:
          'Votre identifiant doit contenir au minimum 6 caractères'
      },
      {
        data: {
          login: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        response:
          'Votre identifiant doit contenir au maximum 45 caractères'
      },
      {
        data: {
          login: 'aaaaaaa',
          password: 'aa'
        },
        response:
          'Votre mot de passe doit contenir au minimum 6 caractères'
      },
      {
        data: {
          login: 'aaaaaa',
          password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        response:
          'Votre mot de passe doit contenir au maximum 45 caractères'
      }
    ]

    data.forEach(element => {
      const { error } = schema.validate(element.data)

      expect(error.message).to.eql(element.response)
    })
  })
})

describe('Auth - login - service - validateRequest', () => {
  it('should return the validate data if all is ok', async () => {
    const data = { login: 'userlogin', password: 'password' }

    const response = await service.validateRequest(data)

    expect(response.error).to.be.null
    expect(response.result).to.eql(data)
  })

  it('should return an error with some bad data sent to the validator', async () => {
    const data = [
      {
        data: {},
        response: 'Veuillez indiquer votre identifiant'
      },

      { data: { login: 'aaaaaa' }, response: 'Veuillez indiquer votre mot de passe' },
      { data: { password: 'aaaaaa' }, response: 'Veuillez indiquer votre identifiant' },

      {
        data: { login: 'aaaaaa', password: '' },
        response: 'Veuillez indiquer votre mot de passe'
      },
      {
        data: { login: '', password: 'aaaaaa' },
        response: 'Veuillez indiquer votre identifiant'
      },

      {
        data: {
          login: 'aa'
        },
        response:
          'Votre identifiant doit contenir au minimum 6 caractères'
      },
      {
        data: {
          login: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        response:
          'Votre identifiant doit contenir au maximum 45 caractères'
      },
      {
        data: {
          login: 'aaaaaaa',
          password: 'aa'
        },
        response:
          'Votre mot de passe doit contenir au minimum 6 caractères'
      },
      {
        data: {
          login: 'aaaaaa',
          password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        },
        response:
          'Votre mot de passe doit contenir au maximum 45 caractères'
      }
    ]

    data.forEach(async element => {
      const { error } = await service.validateRequest(element.data)

      expect(error).to.be.an('object')
      expect(error.error.details[0].message).to.eql(element.response)
    })
  })
})

describe('Auth - login - repository - findByLogin', () => {
  it('should return the user if the login exist', async () => {
    const userFromTheDB: any = await User.findOne({ raw: true })

    const user = await repository.findByLogin(userFromTheDB.login)

    expect(user).to.eql(userFromTheDB)
  })

  it('should return null if there is no user with this login', async () => {
    const user = await repository.findByLogin('NotExistingLogin')

    expect(user).to.be.null
  })
})

describe('Auth - login - service - getUserByCredentials', () => {
  it('should return an error object when the user with a fake login is given', async () => {
    const { user, error } = await service.getUserByCredentials({
      login: 'fakeLogin'
    })

    const expectedError = {
      type: 'unAuthorized',
      message: 'Bad credentials',
      userMessage: 'Aucun profil n\'est associé à cet utilisateur. Veuillez contacter le Support Applicatif ASU',
      error: {}
    }

    expect(user).to.be.null
    expect(error)
      .to.be.an('object')
      .to.eql(expectedError)
  })

  it('should return an error object when the user exist but the password is wrong', async () => {
    const userFromTheDB: any = await User.findOne({ raw: true })
    const { user, error } = await service.getUserByCredentials({
      login: userFromTheDB.login,
      password: 'fake'
    })

    const expectedError = {
      type: 'unAuthorized',
      message: 'Bad credentials',
      userMessage: 'Votre mot de passe est incorrect. Veuillez réessayer',
      error: {}
    }

    expect(user).to.be.null
    expect(error)
      .to.be.an('object')
      .to.eql(expectedError)
  })
})

