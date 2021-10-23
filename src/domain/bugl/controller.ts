import { Request, Response } from 'express'
import Service from './service'

/**
 * GET /
 * returns all Bugl rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllBugl = async (req: Request, res: Response) => {
  const keyword: string = req.query.keyword
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const result = await Service.findAllOrSearch(
    keyword,
    page,
    pageSize,
    orderByCol,
    direction
  )
  res.send(result)
}
