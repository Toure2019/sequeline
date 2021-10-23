import { Request, Response } from 'express'
import Service from '../service/chantier'

const NOTFOUNDMESSAGE = 'chantier not found'

/**
 * GET /chantier
 * returns all Chantier rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllChantier = async (req: Request, res: Response) => {
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const equipeId: string = req.query.equipeId
  const annee: number = req.query.annee
  const numSemaine: number = req.query.num_semaine
  const equipeIdArr = equipeId.indexOf(',') ? equipeId.split(',') : [equipeId]

  const result = await Service.findAll(
    page,
    pageSize,
    orderByCol,
    direction,
    equipeIdArr,
    numSemaine,
    annee
  )
  res.send(result)
}

/**
 * GET /chantierCalc
 * returns all Chantier calculations rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllCalculations = async (req: Request, res: Response) => {
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const chantierId: string = req.query.chantierId
  const result = await Service.findAllCalculations(
    page,
    pageSize,
    orderByCol,
    direction,
    chantierId
  )
  res.send(result)
}

/**
 * GET /chantierCalcAllChantier
 * returns all Chantier  calculations rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllCalculationsForWeek = async (
  req: Request,
  res: Response
) => {
  const equipeId: string = req.query.equipeId
  const equipeIdArr = equipeId.indexOf(',') ? equipeId.split(',') : [equipeId]
  const annee: number = req.query.annee
  const numSemaine: number = req.query.num_semaine
  const result = await Service.findCalcByweekEquipes(
    equipeIdArr,
    numSemaine,
    annee
  )
  res.send(result)
}

/**
 * GET /chantier/users
 * returns all users in chantier
 * @params
 *
 */
export const getAllUsersInChantier = async (req: Request, res: Response) => {
  const chantierId: number = req.query.chantierId

  const result = await Service.findAllUsersByChantier(chantierId)
  res.send(result)
}

/**
 * GET /chantier/details
 * returns all Chantier  calculations rows or search result
 * @params
 * date string
 * equipeId number
 * chantierId number
 */
export const getDetailChantier = async (req: Request, res: Response) => {
  const date: string = req.query.date
  const equipeId: number = req.query.equipeId
  const chantierId: number = req.query.chantierId
  const result = await Service.getDetailChantierDurationForUsers(
    equipeId,
    chantierId,
    date
  )
  res.send(result)
}

/**
 * PUT /chantier
 * Update Chantier by id
 * @params
 * Engin
 */
export const updateChantier = async (req: Request, res: Response) => {
  const chantier: any = req.body
  const validation: any = await Service.validateRequest(chantier)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.update(chantier).catch(err => {
    res.status(500).send(err)
  })
  res.send(result)
}

/**
 * POST /chantier
 * add Chantier
 * @params
 * Engin
 */

export const addChantier = async (req: Request, res: Response) => {
  const chantier: any = (req as any).body.chantier
  const date: any = req.body.date
  const needSave: boolean = req.body.needSave
  const validation: any = await Service.validateRequest(chantier)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }
  const result = await Service.save(chantier, date, needSave).catch(err => {
    res.status(500).send(err.message)
  })
  res.send(result)
}

/**
 * DELETE /chantier
 * Delete Chantier by id
 * @params
 * id
 */

export const deleteChantier = async (req: Request, res: Response) => {
  const id: any = (req as any).body.id
  try {
    const object = await Service.findOneById(id)
    if (object === undefined) {
      return res.status(404).json({ message: NOTFOUNDMESSAGE })
    }
    const result = Service.delete(id)
    res.send(result)
  } catch (e) {
    return res.status(500).send(e)
  }
}

/**
 * Add/Update chantier commentaire
 */
export const updateChantierCommentaire = async (req: Request, res: Response) => {
  const chantierId = req.body.chantierId
  const commentaire = req.body.commentaire
  const result = Service.updateChantierCommentaire(chantierId, commentaire)
  res.send(result)
}
