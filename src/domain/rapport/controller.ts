import { Request, Response } from 'express'
import Service from './service'


/**
 * GET /
 * returns all rapport for a chantier
 * @params
 * chantierId number
 * date
 */
export const getAllChantierRapports = async (req: Request, res: Response) => {
    const chantierId: number = req.query.chantierId
    const result = await Service.findAll(chantierId)
    res.send(result)
  }

/**
 * GET /
 * returns all rapport for a date and chantier
 * @params
 * chantierId number
 * date
 */
export const getRapports = async (req: Request, res: Response) => {
  const date = req.query.date
  const chantierId: number = req.query.chantier
  const result = await Service.findAll(chantierId, date)
  res.send(result)
}

/**
 * ADD / Update
 * add or update rapport
 * @params
 * rapport
 */
export const upsertRapport = async (req: Request, res: Response) => {
  const rapport: string = req.body.rapport

  const validation: any = await Service.validateRequest(rapport)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.upsertRapport(rapport)
  res.send(result)
}

/**
 * Remove all rapport of a specific date from a chantier
 * add or update rapport
 * @params
 * date
 * chantier id
 */
export const removeRapports = async (req: Request, res: Response) => {
    const date: string = req.query.date
    const chantierId: number = req.query.chantierId
    if (date && chantierId) {
        await Service.deleteRapports(chantierId, date).catch(
            err => {
                console.error(err)
                res.status(500).send(err)
            }
        )
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
  }
