import { Request, Response, NextFunction } from 'express'

import Service from './service'
import UnauthorizedError from '../../customErrors/Unauthorized'
import UnprocessableEntityError from '../../customErrors/UnprocessableEntity'
import NotFoundError from '../../customErrors/NotFound'

/**
 * GET /auth/login
 * returns a token when the credentiels are ok
 * @params
 * login: string, password: string
 * pageSize number
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = { login: req.body.login, password: req.body.password }
    const validation: any = await Service.validateRequest(credentials)
    if (validation.error) {
      throw new UnprocessableEntityError(validation.error.userMessage)
    }

    const result = await Service.getUserByCredentials(validation.result)

    if (result.error) {
      throw new UnauthorizedError(result.error.userMessage)
    }

    const token = await Service.generateToken(result.user)

    if (token instanceof Error) {
      throw new NotFoundError(token.message)
    }

    res.status(200).json(token)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'LoginController',
      stack: error,
    })
  }

}
