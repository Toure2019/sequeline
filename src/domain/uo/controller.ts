import { NextFunction, Request, Response } from 'express'
import Service from './service'
import UserService from '../user/service/user'
import Repository from './repository'

/**
 * GET /
 * returns all uo  rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllUo = async (req: Request, res: Response) => {
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  let keyword: string = req.query.keyword
  const typeUo: string = req.query.typeUo
  const noPaging: boolean = req.query.noPaging
  const codeEtab: string = req.query.codeEtablissement
  const currentUser: string = req.user['id']
  const currentRole: string = req.user['role'].libelle

  if (['Responsable', 'Agent'].includes(currentRole)) {
    const userDetail = await UserService.getUserById(currentUser, true)
    keyword = userDetail.t_uo.code
  }

  const result = await Service.findAllOrSearch(
    keyword,
    page,
    pageSize,
    orderByCol,
    direction,
    typeUo,
    noPaging,
    codeEtab
  )
  res.send(result)
}


export const getAllDepartementsUos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {currentDate, codeEtablissement}  = req.query

    const allUosGroupByDepartement = await Repository.findAllUosGroupByDepartement(currentDate, codeEtablissement)

    res.status(200).json(allUosGroupByDepartement)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UOController',
      stack: error,
    })
  }
}

export const getAllUosSousEquipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {uos} = req.body
    const allSousEquipesByUO = await Repository.findAllSousEquipesByUO(uos)
    res.status(200).json(allSousEquipesByUO)
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'UOController',
      stack: error,
    })
  }
}

