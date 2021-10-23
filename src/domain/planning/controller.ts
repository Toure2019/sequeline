import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import Service from './service'
import UserService from '../../services/user.service'

export const getPlanning = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentDate, saturday, currentEtablissement, sousEquipes } = req.query
        const jsonSousEquipes = JSON.parse(sousEquipes)
        const allUsersOfALLSousEquipes = ((await (
          Promise.all(jsonSousEquipes.map(async (ssEquipe: { id: string, libelle: string }) => ({
            users: await UserService.getUsersBySousEquipe(ssEquipe.id, currentEtablissement, currentDate),
            ...ssEquipe,
          })))
        )) as Array<any>)
        const allCodesAbsence = (await Service.getAllCodeAbsence(currentEtablissement)).map((c: { code_hour: string }) => c.code_hour)

        const allSousEquipePlanning = await Promise.all(allUsersOfALLSousEquipes.map(async (ssEquipData: { users: any[], libelle: string, code: string }) => {
          const weekData = await Service.getSousEquipePlanning(ssEquipData.users, saturday, allCodesAbsence)
          const planning = ssEquipData.users.map((u: any) => {
            return {
              ...(weekData.find(p => p.name === u.nom_complet) ? weekData.find(p => p.name === u.nom_complet): {}),
              ...u,
            }
          })
          return {
            code: ssEquipData.code,
            libelle: ssEquipData.libelle,
            planning,
          }
        }))
        res.status(200).json({allSousEquipePlanning, allCodesAbsence})

      } catch (error) {
        next({
          status: error.status || 500,
          message: error.message || '',
          context: 'PlanningController',
          stack: error,
        })
      }
}

export const profilePlanning = async (req: Request, res: Response) => {
    const {currentEtablissement, filePlanning, year} = req.body

    const response = await fetch(`${process.env.FLUX_API_URL}/planning/profile`, {
        method: 'PUT',
        body: JSON.stringify({currentEtablissement, filePlanning, year}),
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()

    res.send(data)

}

export const updatePlanning = async (req: Request, res: Response) => {
    const { processedLegend, processedPlanning, currentEtablissement, uniqueCodeAbsenceFromPlanning  } = req.body

    const response = await fetch(`${process.env.FLUX_API_URL}/planning/update`, {
        method: 'PUT',
        body: JSON.stringify({processedLegend, processedPlanning, currentEtablissement, uniqueCodeAbsenceFromPlanning}),
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()

    res.send(data)
}
