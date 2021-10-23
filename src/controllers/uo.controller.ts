import { NextFunction, Request, Response } from 'express'
import Service from './../services/uo.service'

export const getUOsList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentDate, codeEtablissement } = req.query

        const uos = await Service.getUOsList(currentDate, codeEtablissement)

        const result = uos.map((uo: any) => ({
          ...uo,
          count_sous_equipes: +uo.count_sous_equipes
        }))

        res.status(200).json(result)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'UOController',
          stack: error,
        })
      }
}
