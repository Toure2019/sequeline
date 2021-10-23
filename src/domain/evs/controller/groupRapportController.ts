import { Request, Response } from 'express'
import groupRapportService from '../service/groupRapportService'

/**
 * GET /
 * returns all group rapport rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllGroupRapport = async (req: Request, res: Response) => {
  const codeEtablissement: string = req.query.codeEtablissement
  const result = await groupRapportService.findAll(codeEtablissement)
  res.send(result)
}

/**
 * PUT /
 * Update Group Rapport by id
 * @params
 * rg Rg
 */
export const updateGroupRapport = async (req: Request, res: Response) => {
  const groupSetting: any = req.body
  const validation: any = await groupRapportService.validateRequest(
    groupSetting
  )
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await groupRapportService.findOneById(groupSetting.id)
  if (object === undefined) {
    return res.status(404).json('group Rapport  not found')
  }

  const result = await groupRapportService.update(groupSetting)
  res.send(result)
}

/**
 * POST /
 * Update GroupRapport by id
 * @params
 * rg Rg
 */
export const addGroupRapport = async (req: Request, res: Response) => {
  const groupSetting: any = req.body
  const validation: any = await groupRapportService.validateRequest(
    groupSetting
  )
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await groupRapportService
    .add(groupSetting, groupSetting.codeEtablissement)
    .catch(err => {
      res.status(400).send(err)
    })

  res.send(result)
}

/**
 * DELETE /
 * Delete groupSettings by id
 * @params
 * id
 */

export const deleteGroupRapport = async (req: Request, res: Response) => {
  const id: any = (req as any).body.id

  const object = await groupRapportService.findOneById(id)
  if (object === undefined) {
    return res.status(404).json('groupRapport  not found')
  }
  const result = groupRapportService.delete(id).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}
