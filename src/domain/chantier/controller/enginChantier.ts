import { Request, Response } from 'express'
import Service from '../service/enginChantier'

/**
 * POST /
 * add list of ressource Chantier 
 * @params
 * id
 */

export const addRessourceChantier = async (req: Request, res: Response) => {
  const ressourceChantiers = req.body.ressourceChantiers
  const chantierId = req.body.chantierId

  const validation: any = await Service.validateRequest(ressourceChantiers)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }
  
  const result = await Service.addListRessources(chantierId, ressourceChantiers).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
  
  res.send(result)
}