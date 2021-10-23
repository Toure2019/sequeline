import { Request, Response } from 'express'
import Service from './service'
import Rg from './model'

/**
 * GET /
 * returns all Rg rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllRg = async (req: Request, res: Response) => {
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

/**
 * GET /
 * returns Rg by code
 */
export const getRgByCode = async (req: Request, res: Response) => {
  const result = await Service.findOneByCode(req.query.code)
  res.send(result)
}

/**
 * PUT /
 * Update Rg by code
 * @params
 * rg Rg
 */
export const updateRg = async (req: Request, res: Response) => {
  const rg: Rg = req.body

  const validation: any = await Service.validateRequest(rg)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneByCode(rg.code)
  if (object === undefined) {
    return res.status(404).json('Rg  not found')
  }

  const result = await Service.update(rg)
  res.send(result)
}

/**
 * DELETE /
 * delet rg by code
 * @params
 * code Rg
 */
export const deleteRg = async (req: Request, res: Response) => {
  const code: string = req.query.code
  const result = await Service.delete(code)
  if (result) {
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}

/**
 * PUT /
 * Update Rg by code
 * @params
 * rg Rg
 */
export const updateTypeRg = async (req: Request, res: Response) => {
  const rgData: any = req.body

  const validation: any = await Service.validateRequest(rgData)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneByCode(rgData.t_rg_code)
  if (object === undefined) {
    return res.status(404).json('Rg  not found')
  }

  const result = await Service.updateType(
    rgData.t_rg_code,
    rgData.rg_type
  ).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * GET /
 * returns all Rg for chantier
 * @params
 * codeEtablissement
 */
export const getAllRgForChantier = async (req: Request, res: Response) => {
  const codeEtablissement: string = req.query.codeEtablissement
  const result = await Service.getAllRgByEtablissement(codeEtablissement).catch(
    err => {
      res.status(500).send(err)
    }
  )
  res.send(result)
}
