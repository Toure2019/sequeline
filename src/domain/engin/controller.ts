import { Request, Response } from 'express'
import Service from './service'

const NOTFOUNDMESSAGE = 'engin not found'

/**
 * GET /
 * returns all Engfin rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllEngin = async (req: Request, res: Response) => {
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
 * PUT /
 * Update Engin by id
 * @params
 * Engin
 */
export const updateEngin = async (req: Request, res: Response) => {
  const engin: any = req.body
  const validation: any = await Service.validateRequest(engin)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.update(engin).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * POST /
 * add Engin
 * @params
 * Engin
 */

export const addEngin = async (req: Request, res: Response) => {
  const engin: any = (req as any).body
  const validation: any = await Service.validateRequest(engin)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.save(engin).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * DELETE /
 * Delete Engin by id
 * @params
 * id
 */

export const deleteEngin = async (req: Request, res: Response) => {
  const id: any = (req as any).body.id

  const object = await Service.findOneById(id)
  if (object === undefined) {
    return res.status(404).json({ message: NOTFOUNDMESSAGE })
  }
  const result = Service.delete(id)
  res.send(result)
}

/**
 * GET /
 * Get engin lié au uos active de l'etablissement pour la création de chantier
 * @params
 * code etablissement
 * favori
 */
export const getEnginChantier = async (req: Request, res: Response) => {
  const codeEtablissement: any = req.query.codeEtablissement
  const favori: any = req.query.favori
  const equipeId: number = req.query.equipeId

  const result = await Service.findByFilter(req.user, codeEtablissement, favori, equipeId).catch(err => {
    res.status(500).send(err)
  })
  res.send(result)
}
