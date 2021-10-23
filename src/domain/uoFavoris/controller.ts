/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express'
import Service from './service'

/**
 * GET /
 * returns all uo favoris rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllUoFavoris = async (req: Request, res: Response) => {
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const t_table: string = req.query.t_table
  const code: string = req.query.code
  const codeEtablissement: string = req.query.codeEtablissement
  const result = await Service.findAll(
    page,
    pageSize,
    orderByCol,
    direction,
    t_table,
    code,
    codeEtablissement
  )
  res.send(result)
}

export const createUoFavoris = async (req: Request, res: Response) => {
  const uoFavoris: any = (req as any).body
  const validation: any = await Service.validateRequest(uoFavoris)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.create(uoFavoris).catch(err => {
    res.status(500).send(err)
  })
  res.send(result)
}
