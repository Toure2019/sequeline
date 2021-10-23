import { Request, Response } from 'express'
import Service from './service'
import UserService from '../user/service/user'

/**
 * GET /
 * returns all Sous equipe rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllSousEquipe = async (req: Request, res: Response) => {
  let keyword: string = req.query.keyword
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const codeEtablissement: string = req.query.codeEtablissement
  const codeUO: string = req.query.codeUO
  const noPaging: boolean = req.query.noPaging
  const currentUser: string = req.user['id']
  const currentRole: string = req.user['role'].libelle

  if (['Responsable', 'Agent'].includes(currentRole)) {
    const userDetail = await UserService.getUserById(currentUser, true)
    keyword = userDetail.t_user_properties.t_equipe.num_equipe
  }

  const result = await Service.findAllOrSearch(
    keyword,
    page,
    pageSize,
    orderByCol,
    direction,
    codeEtablissement,
    codeUO,
    noPaging
  )
  res.send(result)
}

/**
 * PUT /
 * Update Sous equipe by id
 * @params
 * equipe Sous Equipe
 */
export const updateSousEquipe = async (req: Request, res: Response) => {
  const sousEquipe: any = req.body
  const validation: any = await Service.validateRequest(sousEquipe)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneById(sousEquipe.id)
  if (object === undefined) {
    return res.status(404).json('Sous equipe not found')
  }

  const result = await Service.update(sousEquipe).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * POST /
 * Create new Equipe
 * @params
 * equipe Sous Equipe
 */
export const addSousEquipe = async (req: Request, res: Response) => {
  const sousEquipe: any = req.body

  const validation: any = await Service.validateRequest(sousEquipe)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.save(sousEquipe).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * GET /
 * Get sous equipe lié au uos active de l'etablissement pour la création de chantier
 * @params
 * code etablissement
 */
export const getSousEquipeChantier = async (req: Request, res: Response) => {
  const codeEtablissement: any = req.query.codeEtablissement

  const result = await Service.findSousEquipeChantier(codeEtablissement).catch(
    err => {
      res.status(500).send(err)
    }
  )
  res.send(result)
}

export const getEquipeRgType = async (req: Request, res: Response) => {
  const equipeId: any = req.query.equipeId

  const result = await Service.getEquipeRgType(equipeId).catch(err => {
    res.status(500).send(err)
  })
  res.send(result)
}
