import { Request, Response } from 'express'
import Service from './service'

/**
 * GET /
 * Get segment gestion pour la création de chantier
 * @params
 * code etablissement
 */
export const getSegmentGestionChantier = async (req: Request, res: Response) => {
  const codeEtablissement: any = req.query.codeEtablissement
  const toClient: any = req.query.toClient
  const idDepartement: any = req.query.idDepartement
  const compteId: any = req.query.compteId

  const result = await Service.findSegmentGestionChantier(codeEtablissement, toClient, idDepartement, compteId).catch(err => {
    res.status(500).send(err)
  })
  res.send(result)
}
