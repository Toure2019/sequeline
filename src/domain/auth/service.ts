/* eslint-disable @typescript-eslint/camelcase */
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { Request } from 'express'

import Repository from './repository'
import LoginSchema from './loginSchema'
import logger from '../../util/logger'
import secretKey from '../../config/secret'
import UserService from '../user/service/user'
import RoleService from '../user/service/role'
import { get422Error } from '../../util/util'

class Service {
  static async validateRequest(data: any) {
    const response = LoginSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async getUserByCredentials(data: any) {
    let user: any = await Repository.findByLogin(data.login)
    let error = null

    // Check user exist
    if (!user) {
      error = {
        type: 'unAuthorized',
        message: 'Bad credentials',
        userMessage: 'Aucun profil n\'est associé à cet utilisateur. Veuillez contacter le Support Applicatif ASU',
        error: {}
      }

      return { user, error }
    }
    // check password is good
    if (user.password !== md5(`${data.login}${data.password}`)) {
      user = null

      error = {
        type: 'unAuthorized',
        message: 'Bad credentials',
        userMessage: 'Votre mot de passe est incorrect. Veuillez réessayer',
        error: {}
      }

      return { user, error }
    }

    // check user us enabled
    if (user.enabled !== 1) {
      user = null

      error = {
        type: 'unAuthorized',
        message: 'Not verified',
        userMessage: 'Votre profil utilisateur n\'est pas actif dans ASR. Veuillez contacter le Support Applicatif ASU',
        error: {}
      }

      return { user, error }
    }

    const roles = await RoleService.findAllUserRolesAccessibles(user.id)
    return { user, roles, error }
  }

  static async generateToken(user: any) {
    const roles = await UserService.getUserRoles(user)

    const token = jwt.sign(
      {
        user: {
          id: user.id
        },
        role: roles
      },
      secretKey,
      {
        expiresIn: '1d'
      }
    )

    const loggedUser = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      mail: user.mail,
      phone: user.phone,
      login: user.login,
      is_superuser: user.is_superuser,
      etablissement: user.etablissement ? {
        id: user.etablissement.code,
        libelle: user.etablissement.libelle,
      } : null,
      roles,
      sousEquipe: user.sousEquipe,
    }

    return { token, user: loggedUser }
  }

  static DecodeToken(token: string) {
    let decodedObj
    try {
      decodedObj = jwt.verify(token, 'secretKeyToGenerte')
    } catch (err) {
      logger.error(err)
    }

    return decodedObj
  }

  static getToken = (req: Request) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretKey)

    return decodedToken
  }
}

export default Service
