import { getDatesWeek } from './../../util/util'
/* eslint-disable @typescript-eslint/camelcase */
import { DATEFORMAT, now } from '../../util/util'
import DB from '../../database/connection'
import { Op, QueryTypes } from 'sequelize'
import moment from 'moment'
import models from '..'

class Repository {
  static async updatePlanningDay(data: any, transaction = null) {
    let result: any

    const deleteQuery1 = 'delete from t_user_planning_default where t_user_id = :userId and date = :date'

    await DB.query(deleteQuery1, {
      type: QueryTypes.DELETE,
      raw: true,
      replacements: { userId: data.userId, date: data.date },
      transaction: transaction
    })

    const insertQuery1 = 'insert into t_user_planning_default (t_user_id, code_hour, date, old) values (:userId, :codeHour, :date, \'0\')'

    await DB.query(insertQuery1, {
      type: QueryTypes.INSERT,
      raw: true,
      replacements: { userId: data.userId, date: data.date, codeHour: data.codeHour },
      transaction: transaction
    })

    const deleteQuery2 = 'delete from t_user_planning where t_user_id = :userId and date = :date'

    await DB.query(deleteQuery2, {
      type: QueryTypes.DELETE,
      raw: true,
      replacements: { userId: data.userId, date: data.date },
      transaction: transaction
    })

    const insertQuery2 =  'insert into t_user_planning (t_user_id, date, update_manual, old, detach, t_uo_code_detach, duration_detach, code_hour_recup) '
                          +'values (:userId, :date, \'1\', \'0\', :detachDuration, \'-1\', \'00:00:00\', :codeHourRecup)'

    await DB.query(insertQuery2, {
      type: QueryTypes.INSERT,
      raw: true,
      replacements: { userId: data.userId, date: data.date, detachDuration: data.detachDuration, codeHourRecup: data.codeHourRecup },
      transaction: transaction
    })

    
    const deleteQuery3 = 'DELETE FROM t_hours_user_planning WHERE t_user_planning_date = :date AND t_user_planning_t_user_id = :userId'

    await DB.query(deleteQuery3, {
      type: QueryTypes.DELETE,
      raw: true,
      replacements: { userId: data.userId, date: data.date },
      transaction: transaction
    })

    const updateQuery = 'UPDATE t_user_planning_data_calc '
                        +'SET planning_code_hour = :codeHour, '
                              +'planning_duration = :planningDuration, '
                              +'planning_duration_reel = :planningDurationReel '
                        +'WHERE date = :date AND t_user_id = :userId'

    await DB.query(updateQuery, {
      type: QueryTypes.UPDATE,
      raw: true,
      replacements: { userId: data.userId, planningDuration: data.planningDuration, planningDurationReel: data.planningDurationReel, codeHour: data.codeHour, date: data.date },
      transaction: transaction
    })

    if (data.hours) {
      for (let i = 0; i < data.hours.length; i++) {
        const dayDate = moment(data.date, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss')
        const hours = data.hours[i]
        const insertQuery3 = 'insert into t_hours_user_planning (t_user_planning_t_user_id, t_user_planning_date, start, \"end\") '
                              +'values (:userId, :dayDate, :start, :end)'

        result = await DB.query(insertQuery3, {
          type: QueryTypes.INSERT,
          raw: true,
          replacements: { userId: data.userId, dayDate: dayDate, start: hours.start, end: hours.end },
          transaction: transaction
        })

      }
    }

    return result
  }

  static async insertDataCalc(data, transaction = null) {
    return models.UserPlanningDataCalc.upsert(data, { transaction: transaction })
  }

  static async getUserDataValue(weekDates: string[], annee: number, numSemaine: number, usersIds: number[], transaction = null) {
    const query = 'SELECT t_user_planning_default.t_user_id, t_user_planning_default.date, t_user_planning_default.code_hour, t_user_planning.detach, t_user_planning.code_hour_recup,'
                  +'t_evs.special_nuit, t_evs_week.need_help_take_repos, t_evs_week.need_entretien, t_evs.ecart_start, t_evs.ecart_end, SUM(EXTRACT(EPOCH FROM (t_hours.end - t_hours.start))) AS planning_duration_reel '
                  +'FROM t_user_planning_default '
                  +'JOIN t_user_planning ON t_user_planning.t_user_id = t_user_planning_default.t_user_id AND t_user_planning.date = TO_TIMESTAMP(t_user_planning_default.date, \'YYYY-MM-DD\') '
                  +'JOIN t_user_properties ON t_user_properties.t_user_id = t_user_planning.t_user_id AND t_user_properties.date_effet <= NOW() AND t_user_properties.date_effet_end > NOW() '
                  +'JOIN t_uo ON t_uo.code = t_user_properties.t_uo_code AND t_uo.date_effet <= NOW() AND t_uo.date_effet_end > NOW() '
                  +'LEFT JOIN t_evs ON t_evs.t_user_id = t_user_planning.t_user_id AND t_evs.date = t_user_planning.date '
                  +'LEFT JOIN t_evs_week ON t_evs_week.t_user_id = t_user_planning.t_user_id AND t_evs_week.num_semaine = :numSemaine AND t_evs_week.annee = :annee '
                  +'LEFT JOIN t_hours ON t_hours.code_hour = t_user_planning_default.code_hour AND t_uo.t_etablissement_code = t_hours.t_etablissement_code '
                  +'WHERE t_user_planning_default.date in (:weekDates) and t_user_planning_default.t_user_id in (:usersIds) '
                  +'GROUP BY t_user_planning_default.t_user_id, t_user_planning_default.date, t_user_planning_default.code_hour,'
                  +'t_user_planning.detach, t_user_planning.code_hour_recup, t_evs.special_nuit, t_evs_week.need_help_take_repos, t_evs_week.need_entretien, t_evs.ecart_start, t_evs.ecart_end'

    const result = await DB.query(query, {
                    type: QueryTypes.SELECT,
                    raw: true,
                    replacements: { usersIds: usersIds, numSemaine: numSemaine, annee: annee, weekDates: weekDates },
                    transaction: transaction
                  })

    return result
  }

  static async getDataWeek(usersIdsArr: number[], date: string, oneDayOnly?: boolean, transaction = null): Promise<any> {
    let weekDates
    if (oneDayOnly) {
      weekDates = [date]
    } else { 
      weekDates = getDatesWeek(date)
    }

    const currentDate = now(DATEFORMAT)

    const query = 'select tpdc.date, tpdc.t_user_id, tpdc.planning_code_hour, tpdc.planning_duration, tpdc.planning_duration_reel, tpdc.dispo_duration, tpdc.dispo_duration_spot_ventil, tpdc.is_detach, tpdc.is_special_night, tpdc.is_derangement, tpdc.code_recup, tpdc.ecart_alert, tpdc.evs_state, tpdc.need_help_take_repos, tpdc.need_entretien, tpdc.version, te.id as t_equipe_id, te.num_equipe '
                  +'from t_user_planning_data_calc as tpdc '
                  +'inner join t_user as tu on tu.id = tpdc.t_user_id '
                  +'inner join t_user_properties as tup on tu.id = tup.t_user_id '
                  +'left join t_equipe as te on te.id = tup.t_equipe_id '
                  +'where date in (:weekDates) and tpdc.t_user_id in (:usersIdsArr) and  date_effet <= :currentDate and date_effet_end > :currentDate'
    const result = await DB.query(query, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { weekDates: weekDates, usersIdsArr: usersIdsArr, currentDate: currentDate},
      transaction: transaction
    })
    
    return result
  }

  static async getCodeJsByCode(code: string, codeEtablissement: string, transaction = null) {
    const codeCriteria = code != undefined
      ? { code_hour: code.toUpperCase() }
      : {}
    const result = models.Hours.findAll({
      where: {
        t_etablissement_code: codeEtablissement,
        ...codeCriteria
      },
      transaction: transaction
    })
    return result
  }

  static async saveCodeJsUserChantier(data: any, transaction = null) {
    const result = models.HoursUserPlanning.upsert(data, {transaction: transaction})
    return result
  }

  static async saveCodeAbsenceUserChantier(data: any, transaction = null) {
    const result = models.CodeAbsenceUserChantier.upsert(data, {transaction: transaction})
    return result
  }

  static async getAllAbsenceUser(date: any, userId: number, transaction = null) {
    const result = await models.CodeAbsenceUserChantier.findAll({
      include: [{ model: models.CodeAbsence, attributes: ['code', 'nom', 'journalier'] }],
      raw: true,
      nest: true,
      where: {
        date,
        t_user_id: userId
      },
      transaction: transaction
    })

    const formatedResult = result.map(element => {
      element.code_absence_code = element.t_code_absence.code
      element.code_absence_nom = element.t_code_absence.nom
      element.code_absence_journalier = element.t_code_absence.journalier
      delete element.t_code_absence
      return element
    })
    return formatedResult
  }

  static async getAllCodeJsUser(date: any, userId: number, transaction = null) {
    return await models.HoursUserPlanning.findAll({
      raw: true,
      nest: true,
      where: {
        t_user_planning_date: date,
        t_user_planning_t_user_id: userId
      },
      transaction: transaction
    })
  }

  static async deleteCodeAbsenceUserChantier(
    date: any,
    userId: number,
    absenceId: number,
    transaction = null
  ) {
    const result = models.CodeAbsenceUserChantier.destroy({
      where: {
        date: date,
        t_user_id: userId,
        t_code_absence_id: absenceId
      },
      transaction: transaction
    })
    return result
  }

  static async updateDispoDuration(dispoDuration: number, date: any, userId: number, transaction = null) {
    const updateDurationQuery = 'UPDATE t_user_planning_data_calc '
                              + 'SET dispo_duration = :dispoDuration '
                              + 'WHERE date = :date AND t_user_id = :userId'
    await DB.query(updateDurationQuery, {
      type: QueryTypes.UPDATE,
      raw: true,
      replacements: { date: date, dispoDuration: dispoDuration, userId: userId},
      transaction: transaction
    })
  }

  static async addUserPlanning(userPlanning, transaction = null) {
    return models.UserPlanning.upsert(userPlanning, {transaction: transaction, individualHooks: true})
  }

  static async findAllByUserAndDate(idUser: number, days: string[], transaction = null) {
    return await models.UserPlanning.findAll({
      where: {
        t_user_id: idUser,
        date: {
          [Op.in]: days
        }
      },
      nest: true,
      raw: true,
      transaction: transaction
    })
  }

  static async findUserPlanningDefault(userId: number, date: string, transaction = null) {
    return await models.PlanningDefault.findOne({
      where: {
        t_user_id: userId,
        date,
      },
      transaction,
    })
  }
}

export default Repository
