import { NextFunction, Request, Response } from 'express'
import Service from './../services/sousEquipe.service'

export const getSousEquipesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentDate, codeEtablissement, uos } = req.query

        const sousEquipes: any[] = await Service.getSousEquipesList(currentDate, codeEtablissement)

        let result = []

        uos?.length ?
           result = await Promise.all(sousEquipes.filter(v => uos.includes(v.uo_code))
            .map(async(sousEquipe) => (
            {
              id: sousEquipe.id,
              libelle: sousEquipe.num_equipe,
              nom: sousEquipe.nom,
              uoCode: sousEquipe.uo_code,
              uoLibelle: sousEquipe.uo_libelle_min,
            }
           ))) : result = await Promise.all(sousEquipes.map(async(sousEquipe) => (
          {
            id: sousEquipe.id,
            libelle: sousEquipe.num_equipe,
            nom: sousEquipe.nom,
            departementCode: sousEquipe.departement_code,
            departementLibelle: sousEquipe.departement_libelle_min,
            uoCode: sousEquipe.uo_code,
            uoLibelle: sousEquipe.uo_libelle_min,
            dateFin: sousEquipe.date_end?.split('-').reverse().join('-'),
            agentsCount: await Service.getNumberOfUsers(sousEquipe.id, codeEtablissement, currentDate),
            valideur: null,
            ressourcesCount: null,
          }
         )))

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