/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express'
import AuthService from '../../auth/service'
import Service from './../service/role'
import UserService from './../service/user'
import jwt from 'jsonwebtoken'
import secretKey from './../../../config/secret'
import AuthRepository from '../../auth/repository'

/**
 * GET /
 * returns all roles
 */
export const getAllRoles = async (req: Request, res: Response) => {
  const result = await Service.findAllRoles()
  res.send(result)
}

// export const updateUserRoles = async (req: Request, res: Response) => {
//   const userId = req.body.userId
//   const roles = req.body.roles

//   const result = await Service.updateUserRoles(userId, roles)

//   if (result instanceof Error) {
//     return res.status(401).json(result)
//   }

//   res.send(result)
// }

export const changeRole = async (req: Request, res: Response) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, secretKey)

  const login = await UserService.getUserLoginById(decodedToken['user'])

  const user = await AuthRepository.findByLogin(login)
  const result = await AuthService.generateToken(user)

  res.send(result)
}

export const getUserRolesAccessibles = async (req: Request, res: Response) => {
  try {
    const userId = req.query.id

    const roles: any[] = await Service.findAllUserRolesAccessibles(userId)

    res.send(roles)
  } catch (err) {
    return res.status(422).json(err)
  }
}
