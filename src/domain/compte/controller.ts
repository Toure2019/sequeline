import { Request, Response } from 'express'
import Service from './service'

const NOTFOUNDMESSAGE = 'Compte not found'

/**
 * GET /
 * returns all Comptes rows or search result
 * @params
 * keyword string
 * page number
 * pageSize number
 */
export const getAllComptes = async (req: Request, res: Response) => {
  const keyword: string = req.query.keyword
  const page: number = req.query.page
  const pageSize: number = req.query.pageSize
  const orderByCol: string = req.query.orderByCol
  const direction: string = req.query.direction
  const showInactif: string = req.query.showInactif
  const codeEtablissement: string = req.query.codeEtablissement
  const noProductif: string = req.query.noProductif
  const noPaging: boolean = req.query.noPaging
  
  const result = await Service.findAllOrSearch(
    keyword,
    page,
    pageSize,
    orderByCol,
    direction,
    showInactif,
    codeEtablissement,
    noProductif,
    noPaging
  )
  res.send(result)
}

/**
 * GET /
 * returns Filtre
 * @params
 *
 */
export const getFilter = async (req: Request, res: Response) => {
  const idCompte: number = req.query.idCompte
  const result = await Service.getFiltre(idCompte)
  res.send(result)
}

/**
 * PUT /
 * Update Compte by id
 * @params
 * equipe Sous Equipe
 */
export const updateCompte = async (req: Request, res: Response) => {
  const compte: any = req.body

  const validation: any = await Service.validateRequest(compte)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const object = await Service.findOneById(compte.id)
  if (object === undefined) {
    return res.status(404).json({ message: NOTFOUNDMESSAGE })
  }

  if (compte.filtres && compte.filtres.length > 0) {
    await Service.updateCompteFiltre(compte).catch(err => {
      res.status(400).send(err)
    })
  }

  const result = await Service.update(compte).catch(err => {
    res.status(400).send(err)
  })

  res.status(200).send(result)
}

/**
 * POST /
 * Create new Compte
 * @params
 * Compte
 */
export const addCompte = async (req: Request, res: Response) => {
  const compte: any = req.body
  const validation: any = await Service.validateRequest(compte)
  if (validation.error) {
    return res.status(422).json(validation.error)
  }

  const result = await Service.save(compte).catch(err => {
    res.status(400).send(err)
  })
  if (compte.filtres && compte.filtres.length > 0) {
    await Service.updateCompteFiltre(compte).catch(err => {
      res.status(400).send(err)
    })
  }
  res.status(200).send(result)
}

export const getCompteCodeAbsence = async (req: Request, res: Response) => {
  const codeEtablissement: any = req.query.codeEtablissement
  const result = await Service.getCompteForCodeAbsence(codeEtablissement)
  if (result === undefined) {
    return res.status(412).json({ message: NOTFOUNDMESSAGE })
  }
  res.send(result)
}

export const getSpecialite = async (req: Request, res: Response) => {
  const result = await Service.getSpecialite()
  if (result === undefined) {
    return res.status(500).json({ message: NOTFOUNDMESSAGE })
  }
  res.send(result)
}

export const getTypeCompte = async (req: Request, res: Response) => {
  const result = await Service.getTypeCompte()
  if (result === undefined) {
    return res.status(500).json({ message: NOTFOUNDMESSAGE })
  }
  res.send(result)
}

export const getFilterCompteValues = async (req: Request, res: Response) => {
  const idFilter: any = req.query.idFilter
  const codeEtablissement: any = req.query.codeEtablissement

  const result = await Service.getFilterCompteValues(idFilter, codeEtablissement)
  if (result === undefined) {
    return res.status(500).json({ message: NOTFOUNDMESSAGE })
  }
  res.send(result)
}

export const getComptesWithFilters = async (req: Request, res: Response) => {
  const specialite: any = req.query.specialite
  const typeCompte: any = req.query.typeCompte
  const filters: any = req.query.filters
  const search: any = req.query.search
  const codeEtablissement: any = req.query.codeEtablissement
  const favori: any = req.query.favori

  const result = await Service.getComptesWithFilters(req.user, specialite, typeCompte, filters, search, codeEtablissement, favori)
  if (result === undefined) {
    return res.status(500).json({ message: NOTFOUNDMESSAGE })
  }
  res.send(result)
}

export const isCompteLocalisable = async (req: Request, res: Response) => {
  const compteId: any = req.query.compteId

  const result = await Service.isCompteLocalisable(compteId)
  if (result === undefined) {
    return res.status(500).json({ message: NOTFOUNDMESSAGE })
  }
  res.send(result)
}