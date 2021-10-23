import { Request, Response, NextFunction } from 'express'
import UnprocessableEntityError from '../customErrors/UnprocessableEntity'
import Service from '../services/user.service'
import AuthService from '../domain/auth/service'
import md5 from 'md5'
import NotFoundError from '../customErrors/NotFound'
import UnauthorizedError from '../customErrors/Unauthorized'
import jwt from 'jsonwebtoken'
import secretKey from './../config/secret'
import { getYYYMMDD } from '../util/date'

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credentials = { login: req.body.login, password: req.body.password }
        const validation: any = await AuthService.validateRequest(credentials)
        if (validation.error) {
            throw new UnprocessableEntityError(validation.error.userMessage)
        }

        // Check if user exists
        const user: any = await Service.getUserByLogin(validation.result.login)
        
        if(! user) {
            throw new NotFoundError('L\'utilisateur est introuvable. Veuillez contacter le Support Applicatif ASU')
        }

        // Check password is good
        if (user.password !== md5(`${credentials.login}${credentials.password}`)) {
            throw new UnauthorizedError('Votre mot de passe est incorrect. Veuillez réessayer')
        }

        // check user is active
        if (user.enabled !== 1) {
            throw new UnauthorizedError('Votre profil utilisateur n\'est pas actif dans ASR. Veuillez contacter le Support Applicatif ASU')
        }

        // get user informations
        const userEtablissement: any = await Service.getUserEtablissement(user.id, getYYYMMDD(new Date()))
        const userRoles = await Service.getUserProfils(user, userEtablissement)

        // check user is active
        if (userRoles.length === 0) {
            throw new UnauthorizedError('Aucun rôle n\'est associé à ce profil. Veuillez contacter le Support Applicatif ASU')
        }

        const infos = {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            etablissement: userEtablissement ? {
                id: userEtablissement.code,
                libelle: userEtablissement.libelle,
            } : null,
            sousEquipe: await Service.getUserSousEquipe(user.id),
            roles: userRoles
        }

        // Generate token
        const token = await Service.generateToken(infos)

        res.status(200).json({ token, user: infos })

    } catch (error) {
      next({
        status: error.status || 500,
        message: error.message || '',
        context: 'AuthController',
        stack: error,
      })
    }
}

export const authWithToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body

        const decodedToken = jwt.verify(JSON.parse(token), secretKey)

        const user: any = await Service.getUserById(decodedToken['user'])

        // get user informations
        const userEtablissement: any = await Service.getUserEtablissement(user.id, getYYYMMDD(new Date()))
        const userRoles = await Service.getUserProfils(user, userEtablissement)

        // check user is active
        if (userRoles.length === 0) {
            throw new UnauthorizedError('Aucun rôle n\'est associé à ce profil. Veuillez contacter le Support Applicatif ASU')
        }

        const infos = {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            etablissement: userEtablissement ? {
                id: userEtablissement.code,
                libelle: userEtablissement.libelle,
            } : null,
            sousEquipe: await Service.getUserSousEquipe(user.id),
            roles: userRoles
        }

        // Generate token
        const newToken = await Service.generateToken(infos)

        res.status(200).json({ token: newToken, user: infos })

    } catch (error) {
      next({
        status: error.status || 500,
        message: error.message || '',
        context: 'AuthController',
        stack: error,
      })
    }
}
