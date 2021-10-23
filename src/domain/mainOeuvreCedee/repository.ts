/* eslint-disable @typescript-eslint/camelcase */
import { DATEFORMAT, getDatesWeek } from '../../util/util'
import DB from '../../database/connection'
import { QueryTypes } from 'sequelize'
import moment from 'moment'
import models from '..'

class Repository {

    static async findAllMainOeuvreCedee(date: any, userId: number, transaction = null) {
        const search = {
            date,
            t_user_id: userId
        }
        const result = await models.MainOeuvreCedee.findAll({
            include: [{ model: models.UO, attributes: ['libelle_min'] }],
            raw: true,
            nest: true,
            where: search,
            transaction: transaction
        })

        return this.formatResult(result)
    }

    static async findOneMainOeuvreCedee(date: any, userId: number, codeUO: string, transaction = null) {
        const search = {
            date,
            t_user_id: userId,
            t_uo_code: codeUO
        }
        const result = await models.MainOeuvreCedee.findOne({
            include: [{ model: models.UO, attributes: ['libelle_min'] }],
            raw: true,
            nest: true,
            where: search,
            transaction: transaction
        })
        if (result) {
            result.libelle_uo = result.t_uo.libelle_min
            delete result.t_uo
        }
        return result
    }

    static async findAllMainOeuvreCedeeWeek(numSemaine: number, annee: number, userId: number, transaction = null) {
        const search = {
            annee,
            num_semaine: numSemaine,
            t_user_id: userId
        }
        const result = await models.MainOeuvreCedeeWeek.findAll({
            include: [{ model: models.UO, attributes: ['libelle_min'] }],
            raw: true,
            nest: true,
            where: search,
            transaction: transaction
        })

        return this.formatResult(result)
    }

    static formatResult(data) {
        return data.map(element => {
            element.libelle_uo = element.t_uo.libelle_min
            delete element.t_uo
            return element
        })
    }

    static async saveMainOeuvreCedeeWeek(data: any, transaction = null) {
        return await models.MainOeuvreCedeeWeek.upsert(data, {transaction: transaction})
    }

    static async saveMainOeuvreCedee(data: any, transaction = null) {
        return await models.MainOeuvreCedee.upsert(data, {transaction: transaction})
    }

    static async deleteMainOeuvreCedee(
        date: any,
        userId: number,
        codeUo: string,
        transaction = null
    ) {
        const result = await models.MainOeuvreCedee.destroy({
            where: {
                date: date,
                t_user_id: userId,
                t_uo_code: codeUo
            },
            transaction: transaction
        })
        return result
    }

    static async deleteMainOeuvreCedeeWeek(
        annee: number,
        numSemaine: number,
        userId: number,
        codeUo: string,
        transaction = null
    ) {
        const result = await models.MainOeuvreCedeeWeek.destroy({
            where: {
                annee: annee,
                num_semaine: numSemaine,
                t_user_id: userId,
                t_uo_code: codeUo
            },
            transaction: transaction
        })
        return result
    }

    static async deleteMainOeuvreCedeeWeekIfNoUse(
        date: any,
        userId: number,
        codeUo: string,
        transaction = null) {
        const momentDate = moment(date, DATEFORMAT)
        const weekDates = getDatesWeek(momentDate.format(DATEFORMAT))
        const annee = momentDate.format('YYYY')
        const numSemaine = momentDate.week()
        const deleteQuery = 'DELETE FROM t_main_oeuvre_cd_week '
            + 'WHERE t_user_id = :userId AND t_uo_code = :codeUo AND num_semaine = :numSemaine AND annee = :annee '
            + 'AND NOT EXISTS(SELECT 1 FROM t_main_oeuvre_cd mo WHERE mo.t_user_id = :userId AND mo.t_uo_code = :codeUo AND date IN(:weekDates))'
        await DB.query(deleteQuery, {
            type: QueryTypes.DELETE,
            replacements: { userId: userId, codeUo: codeUo, numSemaine: numSemaine, annee: annee, weekDates: weekDates },
            transaction: transaction
        })
    }
}

export default Repository