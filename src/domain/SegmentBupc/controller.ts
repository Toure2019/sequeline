import { Request, Response } from 'express'
import Service from './service'

const NOTFOUNDMESSAGE = 'Segment  not found'

/**
 * GET /
 * returns all Segments rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllSegments = async (req: Request, res: Response) => {
  const keyword: string = req.query.keyword
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const codeEtablissement: string = req.query.codeEtablissement
  const result = await Service.findAllOrSearch(
    keyword,
    page,
    pageSize,
    orderByCol,
    direction,
    codeEtablissement
  )
  res.send(result)
}

/**
 * PUT /
 * Update segment by code
 * @params
 * segment segment
 */
export const updateSegment = async (req: Request, res: Response) => {
  const segment: any = req.body
  const validation: any = await Service.validateRequest(segment)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneById(segment.id)
  if (object === undefined) {
    return res.status(404).json({ message: NOTFOUNDMESSAGE })
  }

  const result = await Service.update(segment).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}
