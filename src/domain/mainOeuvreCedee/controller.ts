import { Request, Response } from 'express'
import Service from './service'

/**
 * GET /
 * returns main d'oeuvre cedee for a user / day
 * @params
 */
export const getAllMainOeuvreCedee = async (req: Request, res: Response) => {
  const date: string = req.query.date
  const userId: number = req.query.userId

  if (userId && date) {
    const result = await Service.getAllMainOeuvreCedee(date, userId).catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}

/**
 * GET /
 * returns main d'oeuvre cedee for a user / day / uo
 * @params
 */
export const getMainOeuvreCedee = async (req: Request, res: Response) => {
  const date: string = req.query.date
  const userId: number = req.query.userId
  const codeUo: string = req.query.codeUo

  if (userId && date) {
    const result = await Service.getMainOeuvreCedee(date, userId, codeUo).catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}

/**
 * GET /
 * returns main d'oeuvre cedee week for a user / day / uo
 * @params
 */
export const getAllMainOeuvreCedeeWeek = async (req: Request, res: Response) => {
  const annee: number = req.query.annee
  const numSemaine: number = req.query.numSemaine
  const userId: number = req.query.userId

  if (userId && annee && numSemaine) {
    const result = await Service.getAllMainOeuvreCedeeWeek(numSemaine, annee, userId).catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}

/**
 * POST /
 * adds main d'oeuvre cedee for user
 * @params
 */
export const saveMainOeuvreCedee = async (
  req: Request,
  res: Response
) => {
  const data: any = req.body

  const validation: any = await Service.validateMainOeuvreCedee(data)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  if (data) {
    const result = await Service.saveMainOeuvreCedee(data).catch(
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    )
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}

/**
 * POST /
 * adds main d'oeuvre cedee week for user
 * @params
 */
export const saveMainOeuvreCedeeWeek = async (
  req: Request,
  res: Response
) => {
  const data: any = req.body

  const validation: any = await Service.validateMainOeuvreCedeeWeek(data)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  if (data) {
    const result = await Service.saveMainOeuvreCedeeWeek(data).catch(
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    )
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}

/**
 * DELETE /
 * deletes main oeuvre cedee
 * @params
 */
export const deleteMainOeuvreCedee = async (
  req: Request,
  res: Response
) => {
  const date: string = req.query.date
  const userId: number = req.query.userId
  const codeUo: string = req.query.codeUo

  if (date && userId && codeUo) {
    await Service.deleteMainOeuvreCedee(date, userId, codeUo).catch(
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    )
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}

/**
 * DELETE /
 * deletes main oeuvre cedee week
 * @params
 */
export const deleteMainOeuvreCedeeWeek = async (
  req: Request,
  res: Response
) => {
  const annee: number = req.query.annee
  const numSemaine: number = req.query.numSemaine
  const userId: number = req.query.userId
  const codeUo: string = req.query.codeUo

  if (annee && numSemaine && userId && codeUo) {
    await Service.deleteMainOeuvreCedeeWeek(annee, numSemaine, userId, codeUo).catch(
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    )
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}