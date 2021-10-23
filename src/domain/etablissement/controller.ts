import { Request, Response } from 'express'
import Service from './service'
import Etablissement from './models/etablissement'

/**
 * GET /
 * returns all Etablissements rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getEtablissements = async (req: Request, res: Response) => {
  res.send(await Service.findAllEtablissements())
}

export const getAllEtablissements = async (req: Request, res: Response) => {
  const keyword: string = req.query.keyword
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const typeUo: string = req.query.typeUo
  const result = await Service.findAllOrSearch(
    keyword,
    page,
    pageSize,
    orderByCol,
    direction,
    typeUo
  )
  res.send(result)
}

/**
 * GET /
 * returns all Etablissements rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllTypesEtablissements = async (
  req: Request,
  res: Response
) => {
  const result = await Service.findAllTypeEtablissement()
  res.send(result)
}

/**
 * PUT /
 * Update etablissement by code
 * @params
 * etablissement Etablissement
 */
export const updateEtablissement = async (req: Request, res: Response) => {
  const etablissement: Etablissement = req.body
  const validation: any = await Service.validateRequest(etablissement)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneByCode(etablissement.code)
  if (object === undefined) {
    return res.status(404).json('Etablissement not found')
  }

  const result = await Service.update(etablissement).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}
