import { Request, Response } from 'express'
import Service from '../service/userChantier'

const NOTFOUNDMESSAGE = 'User chantier not found'

/**
 * PUT /
 * add user Chantier
 * @params
 * id
 */

export const updateUserChantier = async (req: Request, res: Response) => {
  const userChantier: any = req.body

  const result = await Service.update(userChantier).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  res.send(result)
}

/**
 * POST /
 * add list of user Chantier 
 * @params
 * id
 */

export const addUserChantier = async (req: Request, res: Response) => {
  const userChantiers = req.body.userChantiers

  const validation: any = await Service.validateRequest(userChantiers)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }
  
  const result = await Service.addList(userChantiers).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  
  res.send(result)
}

/**
 * GET /userChantier
 * returns one user chantier
 */
export const findOneById = async (req: Request, res: Response) => {
  const date: string = req.query.date
  const planningUserId: number = req.query.planningUserId
  const userChantierId: number = req.query.userChantierId
  if (!planningUserId || !userChantierId || !date) {
    res.status(400).send('idUser et/ou userChantierId et/ou date null')
  }
  const result = await Service.findOneById(
    planningUserId,
    userChantierId,
    date
  ).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  res.send(result)
}

/**
 * GET /userChantiers
 * returns all chantier by user/date
 */
export const findAllChantierByUser = async (req: Request, res: Response) => {
  const date: string = req.query.date
  const idUser: number = req.query.idUser
  if (!idUser || !date) {
    res.status(400).send('idUser et/ou date null')
  }
  const result = await Service.findAllChantierByUser(
    idUser,
    date
  ).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  res.send(result)
}

/**
 * DELETE /userChantier
 * Delete user Chantier by id
 * @params
 * id
 */

export const deleteUserChantier = async (req: Request, res: Response) => {
  const idChantier: number = req.query.idChantier
  const idUser: number = req.query.idUser
  const date: string = req.query.date

  if (!idChantier || !idUser || !date) {
    res.status(400).send('idChantier et/ou idUser et/ou date null')
  }
  const object = await Service.findOneById(idChantier, idUser, date).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  if (object === undefined) {
    return res.status(404).json({ message: NOTFOUNDMESSAGE })
  }
  await Service.delete(idChantier, idUser, date).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  res.sendStatus(200)
}
