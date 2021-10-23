import { Request, Response } from 'express'
import Service from './service'

/**
 * POST /
 * duplicate data from agent to list of agents
 * @params
 */
export const duplicate = async (req: Request, res: Response) => {
  const duplicateData = req.body

  const validation: any = await Service.validate(duplicateData)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.duplicate(duplicateData)
  res.send(result)
}
