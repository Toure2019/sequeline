import { Request, Response } from 'express'
import groupSettingsService from '../service/groupSettingsService'

/**
 * GET /
 * returns all group settings rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllGroupSettings = async (req: Request, res: Response) => {
  const codeEtablissement: string = req.query.codeEtablissement
  const result = await groupSettingsService.findAll(codeEtablissement)
  res.send(result)
}

/**
 * PUT /
 * Update GroupSettings by id
 * @params
 * rg Rg
 */
export const updateGroupSettings = async (req: Request, res: Response) => {
  const groupSetting: any = req.body
  const validation: any = await groupSettingsService.validateRequest(
    groupSetting
  )
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await groupSettingsService.findOneById(groupSetting.id)
  if (object === undefined) {
    return res.status(404).json('groupSetting  not found')
  }

  const result = await groupSettingsService.update(groupSetting)
  res.send(result)
}

/**
 * POST /
 * Update GroupSettings by id
 * @params
 * rg Rg
 */
export const addGroupSettings = async (req: Request, res: Response) => {
  const groupSetting: any = req.body
  const validation: any = await groupSettingsService.validateRequest(
    groupSetting
  )
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await groupSettingsService
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

export const deleteGroupSettings = async (req: Request, res: Response) => {
  const id: any = (req as any).body.id

  const object = await groupSettingsService.findOneById(id)
  if (object === undefined) {
    return res.status(404).json('groupSetting  not found')
  }
  const result = groupSettingsService.delete(id).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}
