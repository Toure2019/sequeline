import { Request, Response } from 'express'
import evsService from '../service/evsService'

/**
 * GET /
 * returns all evs values for user and week
 * @params
 * date string
 * userId string
 */
export const getEvsbyUserWeek = async (req: Request, res: Response) => {
  const userId: string = req.query.userId
  const date: string = req.query.date
  const result = await evsService.findAll(date, userId).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * POST /
 * update all evs values for user and week
 * @params
 * Body Array of evs_data
 */
export const postEvsbyUserWeek = async (req: Request, res: Response) => {
  const evsData: any = (req as any).body
  const result = await evsService.upsert(evsData).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}


