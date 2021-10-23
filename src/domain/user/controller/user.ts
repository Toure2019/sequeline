/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response, NextFunction } from 'express'
import Service from '../service/user'
import RoleService from '../service/role'
import AuthService from '../../auth/service'
import SousEquipeService from '../../sousEquipe/service'
import UnauthorizedError from '../../../customErrors/Unauthorized'
import NotFoundError from '../../../customErrors/NotFound'
import UnprocessableEntityError from '../../../customErrors/UnprocessableEntity'

/**
 * GET /
 * returns all Users rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllUtilisateurs = async (req: Request, res: Response) => {
  const keyword: string = req.query.keyword
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const codeEtablissement: string = req.query.codeEtablissement
  const codeEquipe: number = req.query.codeEquipe
  const showInactive: number = req.query.showInactive == 'true' ? 1 : 0
  let result = {}
  if (codeEquipe) {
    result = await Service.findAllbyEquipe(
      page,
      pageSize,
      orderByCol,
      direction,
      codeEquipe
    )
  } else {
    result = await Service.findAllOrSearch(
      keyword,
      page,
      pageSize,
      orderByCol,
      direction,
      codeEtablissement,
      showInactive,
      codeEquipe
    )
  }

  res.send(result)
}

/**
 * GET /
 * returns all Users of list equipe
 * @params
 */
export const getAllUtilisateursByListEquipe = async (req: Request, res: Response) => {
  let codesEquipe = req.query.codesEquipe
  const token = AuthService.getToken(req)
  const userId = token['user'].id

  codesEquipe = codesEquipe.indexOf(',') ? codesEquipe.split(',') : [codesEquipe]
  const result = await Service.findAllByListEquipe(codesEquipe, userId)

  res.send(result)
}

/**
 * GET /
 * returns user
 */
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.query.id
  const result: any = await Service.getUserById(userId)
  if (result instanceof Error) {
    return res.status(404).json({ userMessage: result.message })
  }

  res.send(result)
}

/**
 * GET /
 * returns User & sous-équipe
 */
export const getUsersExterieurs = async (req: Request, res: Response) => {
  const listEquipeId: string = req.query.listEquipe
  const codeEtablissement: string = req.query.codeEtablissement
  const equipeIdArr: number[] = listEquipeId.indexOf(',')
    ? listEquipeId.split(',').map(x => +x)
    : [Number(listEquipeId)]
  const result = await Service.selectSearch(equipeIdArr, codeEtablissement)
  res.send(result)
}

/**
 * GET /
 * returns user informations
 */
export const getUserInformations = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = AuthService.getToken(req)
    const currentUser = token['user']

    const { userId = req.query.id } = currentUser
    const date = req.query.date

    if (
      userId != currentUser &&
      token['role'].id != 1 &&
      token['role'].id != 11
    ) {
      throw new UnauthorizedError('Utilisateur non autorisé')
    }

    const user = await Service.findUserById(userId)

    if (! user) {
      throw new NotFoundError('Utilisateur non trouvé')
    }

    user['rolesAccessibles'] = await RoleService.findAllUserRolesAccessibles(
      user.id
    )

    // Récupérer l'objet UserProperties le plus récent
    const allUserProperties = await Service.getUserProperties(userId, date)
    // Final output
    if (allUserProperties.length > 0) {
      const userProperties = allUserProperties.shift()

      // Récupérer t_code_ressource_code
      // const codeRessource = await Service.getEmploiRepereCodeRessourceFromUserProperties(
      //   userProperties
      // )

      // Récupérer superviseur
      const codeSuperviseur = await Service.getUserSuperviseur(
        userProperties.t_equipe_id,
        userProperties['t_uo.code'],
        userProperties['t_uo.t_uo_code_parent']
      )

      user['userProperties'] = userProperties
      user['uo'] = {
        code: userProperties['t_uo.code'],
        libelle: userProperties['t_uo.libelle']
      }
      user['superviseur'] = codeSuperviseur ? codeSuperviseur : ''
      user['etablissement'] = {
        code: userProperties['t_uo.t_etablissement.code'],
        libelle: userProperties['t_uo.t_etablissement.libelle']
      }
      user['sousEquipes'] = await SousEquipeService.findAll(0, 10, 'id', 'ASC', user['etablissement'].code, user['uo'].code, true)

      user['departement'] = {
        code: userProperties['t_uo.t_departement.code'],
        libelle: userProperties['t_uo.t_departement.libelle']
      }
      user['rg'] = {
        code: userProperties['t_uo.t_departement.t_rg.code'],
        libelle_min: userProperties['t_uo.t_departement.t_rg.libelle_min']
      }

      user['division'] = {
        code: userProperties['t_uo.t_departement.t_rg.t_division.code'],
        libelle_min:
          userProperties['t_uo.t_departement.t_rg.t_division.libelle_min']
      }

      user['codeRessource'] = {
        t_code_ressource_code: userProperties['t_code_ressource_code']
      }

      if (userProperties.t_equipe_id) {
        user['equipe'] = {
          id: userProperties['t_equipe.id'],
          numEquipe: userProperties['t_equipe.num_equipe'],
          nom: userProperties['t_equipe.nom']
        }
      }
    }

    res.status(200).json(user)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserController',
      stack: error,
    })
  }
}

/**
 * GET /
 * returns all CodeRessources rows
 */
export const getAllCodeRessources = async (req: Request, res: Response) => {
  const codeEtablissement: string = req.query.codeEtablissement
  const result = await Service.findAllCodeRessources(codeEtablissement)
  res.send(result)
}

/**
 * PUT /
 * Update user by id
 * @params
 * user
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {error, result } = Service.validateRequest(req.body)

    if (error) {
      throw new UnprocessableEntityError(error.userMessage)
    }

    const response = await Service.updateUser(result)

    res.status(200).json(response)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserController',
      stack: error,
    })
  }
}
