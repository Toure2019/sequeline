import { NextFunction, Request, Response } from 'express'
import { getSNCFWeekNumber, getYYYMMDD } from '../util/date'
import Service from './../services/chantier.service'

export const getTypesChantier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const types = [{
            id: 1,
            name: 'Travaux'
        },
        {
            id: 2,
            name: 'Maintenance'
        },
        {
            id: 3,
            name: 'Non Productif'
        },
        {
            id: 4,
            name: 'Sinistre'
        },
        {
            id: 5,
            name: 'Projet'
        },
        {
            id: 6,
            name: 'Prestation URA'
        },
        {
            id: 7,
            name: 'Prestation diverse'
        },
        {
            id: 8,
            name: 'Entretien des engins'
        },
        {
            id: 9,
            name: 'OGE'
        },
        {
            id: 10,
            name: 'Tiers'
        },
      ]

        res.status(200).json(types)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'CompteController',
          stack: error,
        })
      }
}

export const getSpecialites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const specialites = [
        {
            id: 5,
            name: 'ALL'
        },
        {
            id: 1,
            name: 'VOIE'
        },
        {
            id: 2,
            name: 'SE'
        },
        {
            id: 3,
            name: 'CAT'
        },
        {
            id: 4,
            name: 'SM'
        },
        {
            id: 6,
            name: 'SE - SM'
        },
        {
            id: 7,
            name: 'TELECOM'
        },
        {
            id: 8,
            name: 'OA/OT'
        },
        {
            id: 9,
            name: 'EALE'
        },
        {
            id: 10,
            name: 'MOET'
        },
        {
            id: 11,
            name: 'NPM'
        },
        {
            id: 12,
            name: 'CIRCULATION'
        },
        {
            id: 13,
            name: 'INFORMATIQUE'
        },
      ]

        res.status(200).json(specialites)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'CompteController',
          stack: error,
        })
      }
}

export const getFamilles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const familles = [{
            id: 1,
            name: 'Famille 1'
        },
        {
            id: 2,
            name: 'Famille 2'
        },
        {
            id: 3,
            name: 'Famille 3'
        },
      ]

        res.status(200).json(familles)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'CompteController',
          stack: error,
        })
      }
}

export const getNatures = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const natures = [{
            id: 1,
            name: 'Nature 1'
        },
        {
            id: 2,
            name: 'Nature 2'
        },
        {
            id: 3,
            name: 'Nature 3'
        },
      ]

        res.status(200).json(natures)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'CompteController',
          stack: error,
        })
      }
}

export const getConditionsIntervention = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conditions = await Service.getConditionsInterventionList()

      res.status(200).json(conditions)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'CompteController',
          stack: error,
        })
      }
}

export const getComptes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentDate, codeEtablissement, specialite, typeCompte, keyword } = req.query
        const comptes = await Service.getComptesList(currentDate, codeEtablissement, specialite, typeCompte, keyword)

        res.status(200).json(comptes)

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'CompteController',
          stack: error,
        })
      }
}

export const insertChantier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, currentDate, saturday, compte, condition, sousEquipe } = req.body

      const weekDays = Array.from({length: 7}).map((o,e) => e).map(e => {
        const tomorrow = new Date(saturday)
        tomorrow.setDate(tomorrow.getDate() + e)
        return getYYYMMDD(tomorrow)
      })
  
      const date = new Date(currentDate)

      const year = date.getFullYear()
      const weekNmber = getSNCFWeekNumber(year, `${year}-${date.getMonth() + 1}-${date.getDate()}`) + 1

      const result = await Service.insertChantier(userId, year, weekNmber, currentDate, compte, condition, sousEquipe, weekDays)

      if(result.error){
        res.status(result.error.status).json(result.error.message)
      }

      res.status(200).json(result.chantier)

    } catch (error) {
      next({
        status: error.status || 500,
        message: error.message || '',
        context: 'ChantierController',
        stack: error,
      })
    }
}

export const getChantiersList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, currentDate, sousEquipes } = req.query

    const date = new Date(currentDate)

    const year = date.getFullYear()
    const weekNmber = getSNCFWeekNumber(year, `${year}-${date.getMonth() + 1}-${date.getDate()}`) + 1

    const result = await Service.getChantiers(userId, year, weekNmber, currentDate, sousEquipes)

    res.status(200).json(result)

  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'ChantierController',
      stack: error,
    })
  }
}

export const getPlanningChantier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chantierId, currentDate, saturday, currentEtablissement } = req.query

    const weekDays = Array.from({length: 7}).map((o,e) => e).map(e => {
      const tomorrow = new Date(saturday)
      tomorrow.setDate(tomorrow.getDate() + e)
      return getYYYMMDD(tomorrow)
    })

    const result = await Service.getChantierPlanning(currentEtablissement, chantierId, currentDate, weekDays)

    res.status(200).json(result)

  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'ChantierController',
      stack: error,
    })
  }
}


export const updateChantierCommentaire = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chantierId, commentaire } = req.body
   
    const result = await Service.updateChantierCommentaire(chantierId, commentaire)

    if(result.error){
      res.status(result.error.status).json(result.error.message)
    }

    res.status(200).json(result.chantier)

  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || '',
      context: 'ChantierController',
      stack: error,
    })
  }
}

export const updateImputationChantier = async (req: Request, res: Response) => {
  try {
    const { chantierId, shakedState } = req.body
   
    await Service.updateImputationChantier(chantierId, shakedState)

    res.status(200).json({saved: true})

  } catch (error) {
      res.status(500).json('Une erreur est survenue lors de la mise à jour des heures. Veuillez vérifier votre saisie.')
  }
}
