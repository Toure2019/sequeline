import { Request, Response } from 'express'
import Service from './service'

/**
 * GET /
 * returns all codes Absences rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllCodesAbsence = async (req: Request, res: Response) => {
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

export const getAllCodesAbsenceBy = async (req: Request, res: Response) => {
  const codeEtablissement: string = (req as any).query.codeEtablissement
  const journalier: string = req.query.journalier
  const result = await Service.findAllBy(codeEtablissement, journalier).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}

/**
 * GET /
 * returns all codes Absences rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getOneCodeAbsence = async (req: Request, res: Response) => {
  const absenceId: any = req.params.id
  if (!absenceId || isNaN(absenceId)) {
    res.sendStatus(400)
  } else {
    const result = await Service.findOneByCode(parseInt(absenceId))
    res.send(result)
  }
}

/**
 * PUT /
 * Update codes Absences by code
 * @params
 * rg Rg
 */
export const updateCodeAbsence = async (req: Request, res: Response) => {
  const codeAbsence: any = req.body
  const validation: any = await Service.validateRequest(codeAbsence)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneByCode(codeAbsence.id)
  if (object === undefined) {
    return res.status(404).json('Code absence  not found')
  }

  const result = await Service.update(codeAbsence)
  res.send(result)
}

export const createCodeAbsence = async (req: Request, res: Response) => {
  const codeAbsence: any = (req as any).body
  const validation: any = await Service.validateRequest(codeAbsence)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.add(codeAbsence).catch(err => {
    res.status(400).send(err)
  })
  res.send(result)
}
