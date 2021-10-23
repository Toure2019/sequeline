import { Request, Response } from 'express'
import Service from './service'

/**
 * GET /
 * returns all calculations for productivity
 * @params
 */
export const getCalculationsProductivite = async (
  req: Request,
  res: Response
) => {
  const equipeId: string = req.query.equipeId
  const date: any = req.query.date
  const userId: any = req.query.userId
  const usersExtId: string = req.query.usersExtId || null// Utilisateurs supplémentaires non affiliés aux équipes

  if (!equipeId || !date) {
    res.sendStatus(400)
  }
  const equipeIdArr: string[] = equipeId.indexOf(',')
    ? equipeId.split(',')
    : [equipeId]

  let usersExtIdArr = []
  if (usersExtId) {
    usersExtIdArr = usersExtId.indexOf(',')
    ? usersExtId.split(',').map(x => +x)
    : [Number(usersExtId)]
  }
  

  if (equipeIdArr && date) {
    const result = await Service.getDisponibiliteCalc(equipeIdArr, date, userId, usersExtIdArr).catch(
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
 * GET /
 * returns all codes Js
 * @params
 */
export const getCodeJsByCode = async (req: Request, res: Response) => {
  const code: string = req.query.code
  const codeEtablissement: string = req.query.codeEtablissement
  if (codeEtablissement) {
    const result = await Service.getCodeJsByCode(
      code,
      codeEtablissement
    ).catch(
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
 * adds absence for user
 * @params
 */
export const saveCodeAbsenceUserChantier = async (
  req: Request,
  res: Response
) => {
  const data: any = req.body

  const validation: any = await Service.validateAbsenceUser(data)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  if (data) {
    const result = await Service.saveCodeAbsenceUserChantier(data).catch(
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
 * deletes absence for user
 * @params
 */
export const deleteCodeAbsenceUserChantier = async (
  req: Request,
  res: Response
) => {
  const date: string = req.query.date
  const userId: number = req.query.userId
  const absenceId: number = req.query.absenceId

  if (date && userId && absenceId) {
    await Service.deleteCodeAbsenceUserChantier(date, userId, absenceId).catch(
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
 * POST /
 *  update Planning for user
 * @params
 */
export const updatePlanning = async (req: Request, res: Response) => {
  const data: any = req.body

  const validation: any = await Service.validateRequest(data)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  if (data) {
    const result = await Service.updatePlanning(data).catch(
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
 * GET /
 * returns all absences users
 * @params
 */
export const getAllAbsenceUser = async (req: Request, res: Response) => {
  const date: string = req.query.date
  const userId: number = req.query.userId

  if (userId && date) {
    const result = await Service.getAllAbsenceUser(date, userId).catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
    res.send(result)
  } else {
    res.sendStatus(400)
  }
}
