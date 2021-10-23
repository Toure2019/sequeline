import { Request, Response } from 'express'
import fieldRulesService from '../service/fieldRulesService'

/**
 * GET /
 * returns all field rules rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllEvsRules = async (req: Request, res: Response) => {
  const choix: number = req.query.choix
  const codeEtablissement: string = req.query.codeEtablissement
  if (codeEtablissement) {
    const result = await fieldRulesService.findAll(choix, codeEtablissement)
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}

/**
 * POST /
 * setDefault values
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const setDefaultValues = async (req: Request, res: Response) => {
  const codeEtablissement: string = req.body.codeEtablissement
  const fieldId: string = req.body.fieldId
  const group: string = req.body.group

  const result = await fieldRulesService
    .setDefault(codeEtablissement, fieldId, group)
    .catch(err => {
      console.error(err)
      res.status(400).send(err)
    })
  res.send(result)
}

/**
 * PUT /
 * Update Group Rapport by id
 * @params
 *
 */

export const updateFieldRules = async (req: Request, res: Response) => {
  const fieldRules: any = req.body
  const validation: any = await fieldRulesService.validateRequest(fieldRules)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await fieldRulesService.findOneById(fieldRules.id_field)
  if (object === undefined) {
    return res.status(404).json('fieldRules  not found')
  }

  const result = await fieldRulesService.update(fieldRules)
  res.send(result)
}

export const updateFieldRulesPosition = async (req: Request, res: Response) => {
  const fieldRules: any = req.body
  const validation: any = await fieldRulesService.validateRequest(fieldRules)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await fieldRulesService.findOneById(fieldRules.id_field)
  if (object === undefined) {
    return res.status(404).json('fieldRules  not found')
  }

  const result = await fieldRulesService.updatePosition({
    ...fieldRules,
    ...object
  })
  res.send(result)
}
