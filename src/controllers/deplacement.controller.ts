import { NextFunction, Request, Response } from 'express'
import Service from './../services/deplacement.service'
import { Deplacement } from '../models/deplacement/deplacement.model'

export const insertDeplacement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deplacement: Deplacement = req.body
    const result = await Service.insertDeplacement(deplacement)

    if(result.error){
      res.status(result.error.status).json(result.error.message)
    }
    res.status(200).json(result.deplacement)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'DeplacementController',
      stack: error,
    })
  }
}
