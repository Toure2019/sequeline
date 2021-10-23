/* eslint-disable @typescript-eslint/camelcase */
import { getDatesWeek, get422Error } from '../../util/util'
import duplicateSchema from './duplicateSchema'
import DB from '../../database/connection'
import UserPlanningService from '../userPlanning/service'
import UserService from '../user/service/user'
import ChantierService from '../chantier/service/chantier'
import UserChantierService from '../chantier/service/userChantier'
import EvsService from '../evs/service/evsService'
import moment from 'moment'

class Service {

    static async validate(data: any) {
        const response = duplicateSchema.validate(data)
        const result = response.value
        let error = null

        if (response.error) {
            error = get422Error(response)
        }

        return { result, error }
    }

    static filterAbsence(element, codeAbsences, horaires) {
        return codeAbsences && horaires ||
        codeAbsences && !horaires && element.code_absence_journalier === 1 ||
        !codeAbsences && horaires && element.code_absence_journalier === 0
    }

    static async duplicate(
        duplicateData
    ) {
        let warning
        let error
        const transaction = await DB.transaction()
        try {
            const dateSource = moment(duplicateData.dateSource)
            const dateTarget = moment(duplicateData.dateTarget)
            const weekSource = getDatesWeek(duplicateData.dateSource)
            const weekTarget = getDatesWeek(duplicateData.dateTarget)
            const agentSourceProperties = await UserService.getLastUserProperties(duplicateData.agentSource)

            if (duplicateData.codeAbsences || duplicateData.horaires) {
                // Recuperation dans tous les user planning de l'agent source de la semaine
                const userPlanningSource = await UserPlanningService.findAllByUserAndDate(duplicateData.agentSource, weekSource, transaction)
                for (const day of weekSource) {
                    // On recupere le user planning default
                    const userPlanningDefaultSource = await UserPlanningService.getUserPlanningDefault(duplicateData.agentSource, day)
                    const dateCible = weekTarget[weekSource.indexOf(day)]
                    // On recupere toutes les absences de l'agent source sur la journée
                    const allAbsence = await UserPlanningService.getAllAbsenceUser(day, duplicateData.agentSource, transaction)
                    // On filtre les absences de l'agent source a dupliquer en fonction des parametres selectionner par l'utilisateur
                    const absencesHoraire = allAbsence.filter((e) => this.filterAbsence(e, duplicateData.codeAbsences, duplicateData.horaires))
                    let allCodeJs
                    if (duplicateData.horaires) {
                        // On recupere tous les code js de l'agent source
                        allCodeJs = await UserPlanningService.getAllCodeJsUser(day, duplicateData.agentSource, transaction)
                    }
                    for (const agent of duplicateData.agentCibles) {
                        await this.duplicateAbsences(absencesHoraire, dateCible, agent, transaction)

                        if (duplicateData.horaires) {
                            await this.duplicateHoraires(day, allCodeJs, userPlanningSource, userPlanningDefaultSource, dateCible, agent, transaction)
                        }
                    }
                }
            }

            if (duplicateData.evp) {
                await this.duplicateEvp(duplicateData, dateSource, weekSource, weekTarget, transaction)
            }

            // TODO: gestion des deplacements
            /*if (duplicateData.deplacements) {

            }*/

            if (duplicateData.chantierHeures || duplicateData.chantierSansHeures) {
                warning = await this.duplicateChantier(duplicateData, agentSourceProperties, dateSource, dateTarget, weekSource, weekTarget, transaction)
            }

            transaction.commit()
        } catch (err) {
            error = 'Impossible de dupliquer les chantiers'
            if (transaction) await transaction.rollback()
        }
        return { warning, error }
    }
 
    static async duplicateAbsences(absencesHoraire: any[], dateCible: any, agent: number, transaction) {
        // On crée les absences pour les agents cible pour la journée
        const duplicateAbsence = absencesHoraire.map((e) => {
            return {
                date: dateCible,
                t_code_absence_id: e.t_code_absence_id,
                t_user_id: agent,
                duration: e.duration
            }
        })

        // On enregistre les absences pour les agents cibles
        for (const absence of duplicateAbsence) {
            await UserPlanningService.saveCodeAbsenceUserChantier(absence, transaction)
        }
    }

    static async duplicateHoraires(day: string, allCodeJs: any[], userPlanningSource: any[], userPlanningDefaultSource: any, 
                                    dateCible: any, agent: number, transaction) {
        const duplicateHours = allCodeJs.map((e) => {
            return {
                start: e.start,
                end: e.end
            }
        })

        // On recupere les user planning de l'agent source sur la journée
        const userPlanningSourceDay = userPlanningSource.filter((e) => this.isSameDate(e.date, day))
        // On crée les data pour les codes js des agents cible (identique à une requete front)
        if (userPlanningSourceDay && userPlanningSourceDay.length > 0 && duplicateHours && duplicateHours.length > 0) {
            const data = {
                codeHour: userPlanningDefaultSource.code_hour,
                codeHourRecup: userPlanningSourceDay[0].code_hour_recup,
                date: dateCible,
                detachDuration: userPlanningSourceDay[0].detach,
                userId: agent,
                hours: duplicateHours
            }
            await UserPlanningService.updatePlanning(data, transaction)
        }
    }

    // Pour chaque agent cible, on supprime ses Evp configurer sur la semaine cible, et on y duplique les evp de l'agent source
    static async duplicateEvp(duplicateData: any, dateSource: any, weekSource: string[], weekTarget: string[], transaction) {
        const dateSourceFormat = dateSource.format('YYYY-MM-DD')
        for (const agent of duplicateData.agentCibles) {
            const evsSource = await EvsService.findAllEvsForDuplicate(dateSourceFormat, duplicateData.agentSource, transaction)
            const evsToAdded = evsSource.map((e) => {
                e.date = weekTarget[weekSource.indexOf(moment(e.date).format('YYYY-MM-DD'))]
                e.t_user_id = agent
                return e
            })
            await EvsService.removeListEvs(agent, dateSourceFormat, transaction)
            await EvsService.addListEvs(evsToAdded, transaction)
            const evsDataSource = await EvsService.findAllEvsDataForDuplicate(dateSourceFormat, duplicateData.agentSource, transaction)
            const evsDataToAdded = evsDataSource.map((e) => {
                e.date = weekTarget[weekSource.indexOf(moment(e.date).format('YYYY-MM-DD'))]
                e.t_user_id = agent
                return e
            })
            await EvsService.removeListEvsData(agent, dateSourceFormat, transaction)
            await EvsService.addListEvsData(evsDataToAdded, transaction)
            const evsWeekSource = await EvsService.findAllEvsWeekForDuplicate(dateSourceFormat, duplicateData.agentSource, transaction)
            const evsWeekToAdded = evsWeekSource.map((e) => {
                e.num_semaine = Number(moment(weekTarget[weekSource.indexOf(moment(e.date).format('YYYY-MM-DD'))]).format('ww'))
                e.year = moment(weekTarget[weekSource.indexOf(moment(e.date).format('YYYY-MM-DD'))]).year()
                e.t_user_id = agent
                return e
            })
            await EvsService.removeListEvsWeek(agent, dateSourceFormat, transaction)
            await EvsService.addListEvsWeek(evsWeekToAdded, transaction)
        }
    }

    static async duplicateChantier(duplicateData: any, agentSourceProperties: any, dateSource: any, dateTarget: any, 
                                    weekSource: string[], weekTarget: string[], transaction) {
        let warning
        const agentCiblesProperties = await UserService.getAllUsersProperties(duplicateData.agentCibles)
        const equipeIds = agentCiblesProperties.map((e) => e.t_equipe_id)
        const equipeSource = agentSourceProperties.t_equipe_id
        const chantiersSource = await ChantierService.findAllToDuplicate(equipeSource,
                                        Number(dateSource.format('ww')), dateSource.year())
        const chantiersExist = [equipeSource]
        // Pour chaque equipe cible, on cree des chantier equivalent au chantier source si le parametrage existe pour la semaine cible
        for (const equipeTarget of equipeIds) {
            for (const chantier of chantiersSource) {
                let chantierAdded
                const oldId = chantier.id
                if (chantiersExist.indexOf(equipeTarget) === -1) {
                    // on ajoute l'equipe a la liste pour eviter d'essayer d'enregistrer le chantier pour chaque agent de l'equipe
                    chantiersExist.push(equipeTarget)
                    // on met a jour les champs pour crée le chantier sur la nouvelle equipe cible
                    chantier.t_equipe_id = equipeTarget
                    chantier.annee = dateTarget.year()
                    chantier.num_semaine = Number(dateTarget.format('ww'))
                    delete chantier.id
                    try {
                        chantierAdded = await ChantierService.save(chantier, dateTarget, true, transaction)
                    } catch (err) {
                        warning = 'Certains chantiers n\'ont pas pu être dupliqués'
                        continue
                    }
                } else {
                    chantierAdded = chantier
                }
                
                // Si l'utilisateur a cocher l'option sur le formulaire, on lance la duplication des heures, sur les chantier crées, pour les agents cible
                if (duplicateData.chantierHeures) {
                    await this.duplicateHeuresChantier(duplicateData, oldId, chantierAdded.id, weekSource, weekTarget, transaction)
                }
            }
        }
        return warning
    }

    static async duplicateHeuresChantier(duplicateData: any, 
                                            oldChantierId: number, 
                                            newChantierId: number,
                                            weekSource: string[],
                                            weekTarget: string[],
                                            transaction) {
        // On recupere les heures configurer sur le chantier source de l'agent source
        const userChantiers = await UserChantierService.findAllByChantierAndUser(duplicateData.agentSource, oldChantierId, transaction)
        for (const agent of duplicateData.agentCibles) {
            const userChantiersToAdd = []
            for (const userChantier of userChantiers) {
                // On met a jour les informations des heures pour les appliquers sur l'agent cible sur le nouveau chantier, a la nouvelle date
                userChantier.t_inter_chantier_id = newChantierId
                userChantier.t_user_planning_date = weekTarget[weekSource.indexOf(moment(userChantier.t_user_planning_date).format('YYYY-MM-DD'))]
                userChantier.t_user_planning_t_user_id = agent

                userChantiersToAdd.push(userChantier)
            }
            await UserChantierService.addList(userChantiersToAdd, transaction)
                                
        }
    }

    static isSameDate(firstDate: any, secondDate: string) {
        return firstDate.toString() === new Date(secondDate).toString()
    }
}

export default Service
