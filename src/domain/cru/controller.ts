import { Request, Response } from 'express'
import Service from './service'

const NOTFOUNDMESSAGE = 'Period   not found'

/**
 * GET /
 * returns all Month Periods rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllMonthPeriod = async (req: Request, res: Response) => {
  const annee: number = req.query.annee
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const result = await Service.findAll(page, pageSize, annee)
  res.send(result)
}

/**
 * PUT /
 * Update Month Period by id
 * @params
 * Engin
 */
export const updatePeriod = async (req: Request, res: Response) => {
  const monthPeriod: any = req.body
  const validation: any = await Service.validateRequest(monthPeriod)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.update(monthPeriod).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * POST /
 * add MonthPeriod
 * @params
 * Engin
 */
export const addMonthPeriod = async (req: Request, res: Response) => {
  const monthPeriod: any = req.body
  const validation: any = await Service.validateRequest(monthPeriod)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneByMonthAnnee(
    monthPeriod.annee,
    monthPeriod.mois
  )
  if (object === undefined) {
    return res.status(404).json({ message: NOTFOUNDMESSAGE })
  }

  const result = await Service.save(monthPeriod)
  res.send(result)
}

/**
 * DELETE /
 * Delete MonthPeriod by id
 * @params
 * id
 */

export const deleteMonthPeriod = async (req: Request, res: Response) => {
  const annee: number = (req.params as any).annee
  const mois: number = (req.params as any).mois
  const result = Service.delete(annee, mois)
  res.send(result)
}
