/* eslint-disable @typescript-eslint/camelcase */
import { get422Error, DATEFORMAT } from '../../util/util'
import userPlanningService from '../userPlanning/service'
import moment from 'moment'
import Repository from './repository'
import mainOeuvreCedeeSchema from './schema/mainOeuvreCedeeSchema'
import DB from '../../database/connection'
import mainOeuvreCedeeSchemaWeek from './schema/mainOeuvreCedeeSchemaWeek'

class Service {

    static async validateMainOeuvreCedee(data: any) {
        const response = mainOeuvreCedeeSchema.validate(data)
        const result = response.value
        let error = null

        if (response.error) {
            error = get422Error(response)
        }

        return { result, error }
    }

    static async validateMainOeuvreCedeeWeek(data: any) {
        const response = mainOeuvreCedeeSchemaWeek.validate(data)
        const result = response.value
        let error = null

        if (response.error) {
            error = get422Error(response)
        }

        return { result, error }
    }

    static async getAllMainOeuvreCedee(date: any, userId: number) {
        return Repository.findAllMainOeuvreCedee(date, userId)
    }

    static async getMainOeuvreCedee(date: any, userId: number, codeUO: string) {
        return Repository.findOneMainOeuvreCedee(date, userId, codeUO)
    }

    static async saveMainOeuvreCedee(data: any) {
        const transaction = await DB.transaction()
        try {
            const result = await Repository.saveMainOeuvreCedee(data, transaction)
            await userPlanningService.updateDispoDuration(data.date, data.t_user_id, transaction)
            const momentDate = moment(data.date, DATEFORMAT)
            const dataWeek = {
                num_semaine: momentDate.week(),
                annee: momentDate.format('YYYY'),
                t_uo_code: data.t_uo_code,
                t_user_id: data.t_user_id
            }
            await Repository.saveMainOeuvreCedeeWeek(dataWeek, transaction)
            transaction.commit()
            return result
        } catch (err) {
            console.error(err)
            await transaction.rollback()
            throw err
        }
    }
    
    static async saveMainOeuvreCedeeWeek(data: any) {
        const transaction = await DB.transaction()
        try {
            const result = await Repository.saveMainOeuvreCedeeWeek(data, transaction)
            const momentDay = moment().year(data.annee).week(data.num_semaine).startOf('week')
            for (let i = 0; i < 7; i++) {
                const day = momentDay.format(DATEFORMAT)
                const mainOeuvreDay = data.allMainOeuvreDay ? data.allMainOeuvreDay.find(item => item?.date === day) : null
                if (mainOeuvreDay && mainOeuvreDay.duration) {
                    await Repository.saveMainOeuvreCedee(mainOeuvreDay, transaction)
                } else {
                    await Repository.deleteMainOeuvreCedee(day, data.t_user_id, data.t_uo_code, transaction)
                }
                await userPlanningService.updateDispoDuration(day, data.t_user_id, transaction)
                momentDay.add(1, 'days')
            }
            transaction.commit()
            return result
        } catch (err) {
            console.error(err)
            await transaction.rollback()
            throw err
        }
      }

      static async deleteMainOeuvreCedeeWeek(
        annee: number,
        numSemaine: number,
        userId: number,
        codeUo: string
    ) {
        const transaction = await DB.transaction()
        try {
            const result = await Repository.deleteMainOeuvreCedeeWeek(annee, numSemaine, userId, codeUo, transaction)
            const momentDay = moment().week(numSemaine).year(annee).startOf('week')
            for (let i = 0; i < 7; i++) {
                const day = momentDay.format(DATEFORMAT)
                await Repository.deleteMainOeuvreCedee(
                    day,
                    userId,
                    codeUo,
                    transaction
                )
                await userPlanningService.updateDispoDuration(day, userId, transaction)
                momentDay.add(1, 'days')
            }
            transaction.commit()
            return result
        } catch (err) {
            console.error(err)
            await transaction.rollback()
            throw err
        }
      }

    static async deleteMainOeuvreCedee(
        date: any,
        userId: number,
        codeUo: string
    ) {
        const transaction = await DB.transaction()
        try {
            const result = await Repository.deleteMainOeuvreCedee(
                date,
                userId,
                codeUo,
                transaction
            )
            await Repository.deleteMainOeuvreCedeeWeekIfNoUse(
                date,
                userId,
                codeUo,
                transaction
            )
            await userPlanningService.updateDispoDuration(date, userId, transaction)
            transaction.commit()
            return result
        } catch (err) {
            console.error(err)
            await transaction.rollback()
            throw err
        }
    }

    static async getAllMainOeuvreCedeeWeek(numSemaine: number, annee: number, userId: number) {
        const result = await Repository.findAllMainOeuvreCedeeWeek(numSemaine, annee, userId)
        for (const mainOeuvreWeek of result) {
            const momentDay = moment().week(numSemaine).year(annee).startOf('week')
            mainOeuvreWeek.allMainOeuvreDay = []
            for (let i = 0; i < 7; i++) {
                mainOeuvreWeek.allMainOeuvreDay.push(
                    await this.getOrCreateMainOeuvreCedeeDay(momentDay.format(DATEFORMAT), userId, mainOeuvreWeek.t_uo_code)
                )
                momentDay.add(1, 'days')
            }
        }
        return result
    }

    private static async getOrCreateMainOeuvreCedeeDay(day: string, userId: number, codeUo: string) {
        const element = await Repository.findOneMainOeuvreCedee(day, userId, codeUo)
        if (element) {
            return element
        } else {
            return {
                date: day,
                t_uo_code: codeUo,
                t_user_id: userId,
                duration: null,
                commentaire: null
            }
        }
    }
}

export default Service