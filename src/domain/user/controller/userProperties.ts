/* eslint-disable @typescript-eslint/camelcase */
import { NextFunction, Request, Response } from 'express'
import Service from '../service/user'

/**
 * GET /
 * returns user properties
 */
export const getUserHistorique = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { userId} = req.query
    const result = await Service.findAllUserProperties(
      userId
    )

    res.status(200).json(result)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UserPropertiesController',
      stack: error,
    })
  }
}

/**
 * DELETE /
 * Delete User Properties by userId and dateEffet
 * @params
 * id
 */

export const deleteUserProperties = async (req: Request, res: Response) => {
  const userId: any = (req as any).body.userId
  const dateEffet: any = (req as any).body.dateEffet

  const object = await Service.findOneUserproperties(userId, dateEffet)

  if (object.error) {
    let status = 404
    if (object.error.type == 'internalServerError') {
      status = 500
    }
    return res
      .status(status)
      .json(object.error.message + object.error.userMessage)
  }

  const result = await Service.deleteUserproperties(userId, dateEffet)

  return res.status(200).json(result)
}
