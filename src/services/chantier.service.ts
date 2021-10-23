import { QueryTypes } from 'sequelize'
import { checkExistingChantiersQuery, getUserChantierInSpecificDate, getChantiersQuery, getCompteERPQuery,
    getCompteQuery, getComptesQuery, getUserPlanningInOneDayQuery, insertChantierQuery, getChantierEmployeesQuery, addEmployeesToChantierQuery, getChantierByIdQuery, updateChantierCommentaireQuery, updateAgentImputationChantierQuery, getCodeJSQuery } from '../database/queries/chantier.queries'
import sequelize from '../database/connection'
import UserService from './user.service'
import PlanningService from '../domain/planning/service'

class Service {
    static getConditionsInterventionList() {
        return [{
            id: 1,
            name: 'Travail de jour'
        },
        {
            id: 2,
            name: 'Travail de nuit'
        },
        {
            id: 3,
            name: 'Sortie jour hors DJS'
        },
        {
            id: 4,
            name: 'Sortie nuit hors DJS'
        },
       ]
    }

    static getConditionInterventionById(id: number) {
        const condition = Service.getConditionsInterventionList().find(element => element.id === id)
        return condition.name
    }

    static async getComptesList(currentDate: string, codeEtablissement: string, specialite: string, typeCompte: string, keyword: string) {

        try {
            return await sequelize.query(getComptesQuery(currentDate, codeEtablissement, specialite, typeCompte, keyword), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async insertChantier(userId: string, year: number, weekNumber: number, currentDate: string, compteId: number, condition: string, sousEquipe: string, weekDays: string[]) {

        let chantier = null
        let error = null

        if(!sousEquipe){
            sousEquipe = (await UserService.getUserSousEquipe(+userId, currentDate) as any).id
        }

        const existingChantier =  await sequelize.query(checkExistingChantiersQuery(year, weekNumber, compteId, condition, sousEquipe), { type: QueryTypes.SELECT, nest: true})

        if(existingChantier.length){
            error = {
                message: 'Vous ne pouvez pas ajouter ce chantier car il existe déjà',
                status: 404
            }
            return {chantier, error}
        }

        const compte: any = await sequelize.query(getCompteQuery(currentDate, compteId), { type: QueryTypes.SELECT, nest: true})

        if(compte.length === 0){
            error = {
                message: `Aucun compte existant avec l'id: ${compteId}`,
                status: 404
            }
            return {chantier, error}
        }

        const compteERP: any =  await sequelize.query(getCompteERPQuery(currentDate, compte[0]), { type: QueryTypes.SELECT, nest: true})

        if(compteERP.length === 0){
            error = {
                message: 'Ce chantier ne peut pas être créé car il ne fait pas partie de l\'ERP',
                status: 404
            }
            return {chantier, error}
        }

        const segementDeGestion = '525337' // DNS - Asnières

        chantier = await sequelize.query(insertChantierQuery(compteId, compteERP[0], weekNumber, year, userId, sousEquipe, segementDeGestion, condition), { type: QueryTypes.INSERT, nest: true, plain: true})

        if(! chantier){
            error = {
                message: 'Une erreur est survenue lors d el\'insertion du chantier',
                status: 500
            }
            return {chantier, error}
        }

        // Rattacher les agents de la sous-équipe au chantier créé
        const chantierEmployees = await sequelize.query(getChantierEmployeesQuery(chantier[0].id, currentDate), { type: QueryTypes.SELECT, nest: true})
        await Promise.all(chantierEmployees.map(async (employee: any) => {
            await Promise.all(weekDays.map(async (day: string) => {
                return await sequelize.query(addEmployeesToChantierQuery(chantier[0].id, employee.id, day), { type: QueryTypes.INSERT, nest: true})
            }))
        }))

        return {chantier, error}
    }

    static async getChantiers(userId: string, year: number, weekNumber: number, currentDate: string, sousEquipes: any[]) {
        try {

            if(! sousEquipes || sousEquipes.length === 0) {
                sousEquipes = [(await UserService.getUserSousEquipe(+userId, currentDate) as any).id]
            }
            const result: any[] = []

            for (const equipeId of sousEquipes) {

                const chantiers = await sequelize.query(getChantiersQuery(equipeId, year, weekNumber), { type: QueryTypes.SELECT, nest: true})

                if(chantiers.length) {
                    result.push({
                        equipeId,
                        equipeName: chantiers[0]['equipe'],
                        chantiers: chantiers.map((chantier: any) => ( {
                            chantierId: chantier.id,
                            comments: chantier.commentaire,
                            t_compte_id: chantier.t_compte_id,
                            libelle_chantier: chantier.libellecompte,
                            duree: '00:00',
                            uop: 0,
                            segment: chantier.t_segment_gestion_id,
                            axe_local: chantier.axe_local,
                            condition_intervention: Service.getConditionInterventionById(chantier.t_cpr_id),
                            statut: chantier.clos ? {key: 'clos', label: 'Clos'} : {key: 'open', label: 'Ouvert'},
                          }))
                    })
                }
            }

            return result

        } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getChantierPlanning(currentEtablissement: string, chantierId: string, currentDate: string, weekDays: string[]) {
        
        try {
            const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']

            const chantier: any = await sequelize.query(getChantierByIdQuery(chantierId), {type: QueryTypes.SELECT, nest: true, plain: true})
            const chantierEmployees = await sequelize.query(getChantierEmployeesQuery(chantierId, currentDate), { type: QueryTypes.SELECT, nest: true})
            let result = []
            result = await Promise.all(
                chantierEmployees.map(async(employee: any) => {
                    const planningDay = {}
                    await Promise.all(
                        weekDays.map(async (day, index) => {
                            let value = undefined
                            let tempsRestant = undefined
        
                            const userTAPInSpecificDay: any = await sequelize.query(getUserPlanningInOneDayQuery((employee as any).id, day), { type: QueryTypes.SELECT, nest: true, plain: true})
                            if(userTAPInSpecificDay) {
                                const codeHour = userTAPInSpecificDay.code_hour
                                if(userTAPInSpecificDay.id_t_compte) {
                                    value = codeHour
                                } else {
                                    const codeJS: any = await sequelize.query(getCodeJSQuery(codeHour, currentEtablissement), { type: QueryTypes.SELECT, nest: true, plain: true}) 
                                    const userChantierInSpecificDay: any = await sequelize.query(getUserChantierInSpecificDate(chantierId, (employee as any).id, day), { type: QueryTypes.SELECT, nest: true, plain: true})
                                    value = userChantierInSpecificDay ? userChantierInSpecificDay?.duration?.split(':').slice(0,2).join(':') : '00:00';
                                    const tempsTravail = value.split(':')[0] * 3600000 + value.split(':')[1] * 60000 
                                    tempsRestant = ((codeJS.duree_journee - (codeJS.duree_coupures + codeJS.duree_pauses)) - tempsTravail) / 1000 //temps estant en secondes
                                }
                            }

                            planningDay[days[index]] = {
                                date: day,
                                value,
                                tempsRestant,
                            }
                        })
                    ) 

                    return {
                        id: (employee as any).id,
                        nom_complet: (employee as any).nom_complet,
                        ...planningDay
                    }
                })
            )

            return {
                chantierId,
                allCodesAbsence: (await PlanningService.getAllCodeAbsence(currentEtablissement)).map((c: { code_hour: string }) => c.code_hour),
                planning: result,
                commentaire: chantier.commentaire,
            }

          /*
          Exemple de réponse:
            [
            {
                id: 106210,
                nom_complet: 'TESTUT ROMAIN',
                saturday: { date: '2021-09-04', value: undefined, tempsRestant: undefined },
                friday: { date: '2021-09-10', value: 'RP', tempsRestant: undefined },
                monday: { date: '2021-09-06', value: '00:00', tempsRestant: 26100 },
                sunday: { date: '2021-09-05', value: '00:00', tempsRestant: 26100 },
                wednesday: { date: '2021-09-08', value: '00:00', tempsRestant: 26100 },
                tuesday: { date: '2021-09-07', value: '00:00', tempsRestant: 26100 },
                thursday: { date: '2021-09-09', value: '00:00', tempsRestant: 26100 }
            },
            {
                id: 110318,
                nom_complet: 'BELLARD AGNES',
                saturday: { date: '2021-09-04', value: undefined, tempsRestant: undefined },
                friday: { date: '2021-09-10', value: 'RP', tempsRestant: undefined },
                sunday: { date: '2021-09-05', value: '08:00', tempsRestant: -2700 },
                tuesday: { date: '2021-09-07', value: '00:00', tempsRestant: 26100 },
                wednesday: { date: '2021-09-08', value: '00:00', tempsRestant: 26100 },
                thursday: { date: '2021-09-09', value: '00:00', tempsRestant: 26100 },
                monday: { date: '2021-09-06', value: '07:45', tempsRestant: -1800 }
            }
            ]
          */

        } catch(e) {
            throw new Error(e.message)
        }
    }

    static async updateChantierCommentaire(chantierId: string, commentaire: string) {

        let chantier = null
        let error = null

        chantier = await sequelize.query(getChantierByIdQuery(chantierId), {type: QueryTypes.SELECT, nest: true, plain: true})
          
        if(!chantier){
            error = {
                message: 'Chantier introuvable',
                status: 404
            }
            return {chantier, error}
        }

        const updated: any = await sequelize.query(updateChantierCommentaireQuery(chantierId, commentaire), { type: QueryTypes.UPDATE, plain: true})

        if(!updated){
            error = {
                message: 'Une erreur est survenue lors de la mise à jour du commentaire',
                status: 500
            }
            return {chantier, error}
        }

        return {chantier, error}
    }

    
    static async updateImputationChantier(chantierId: string, planningChantier: any[], currentEtablissement: string) {
        return await Promise.all(planningChantier.map(async (employee: any) => {
            return await Promise.all(Object.entries(employee.planning).map(async (durationPerDay: [string, string]) => {
                const date = durationPerDay[0]
                const duration = durationPerDay[1]
                if(! Service.isCodeAbsence(duration, currentEtablissement)) {
                    await sequelize.query(updateAgentImputationChantierQuery(chantierId, date, employee.id, duration), {type: QueryTypes.INSERT})
                }
            }))
        }))
    }

    static async isCodeAbsence(code: string, currentEtablissement: string) {
        return (await PlanningService.getAllCodeAbsence(currentEtablissement)).map((codeAbs: any) => codeAbs.code_hour === code)
    }

}
export default Service
