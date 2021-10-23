import { Request, Response } from 'express'
import Service from './service'
import Departement from './model'
/**
 * GET /
 * returns all Departements rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllDepartements = async (req: Request, res: Response) => {
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
 * Update departement by code
 * @params
 * departement Departement
 */
export const updateDepartement = async (req: Request, res: Response) => {
  const departement: Departement = req.body
  const validation: any = await Service.validateRequest(departement)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneByCode(departement.code)
  if (object === undefined) {
    return res.status(404).json('Departement not found')
  }

  const result = await Service.update(departement).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * GET /
 * Get departement lié au uos active de l'etablissement pour la création de chantier
 * @params
 * code etablissement
 * favori
 */
export const getDepartementChantier = async (req: Request, res: Response) => {
  const codeEtablissement: any = req.query.codeEtablissement
  const favori: any = req.query.favori
  const equipeId: number = req.query.equipeId

  const result = await Service.findByFilter(
    req.user,
    codeEtablissement,
    favori,
    equipeId
  ).catch(err => {
    res.status(500).send(err)
  })
  res.send(result)
}
