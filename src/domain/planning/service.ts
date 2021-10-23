import { QueryTypes } from 'sequelize'
import { getDurationFromMSec } from '../../util/date'
import NotFoundError from '../../customErrors/NotFound'
import sequelize from '../../database/connection'

class Service {
    static async getSousEquipe(userId: string, currentDate: string) {

        const selectUserEquipeQuery = `
              select id, num_equipe, nom
              from t_equipe, t_user_properties where
              t_user_properties.t_user_id = '${userId}'
              AND t_user_properties.t_equipe_id = t_equipe.id
              AND t_user_properties.date_effet < '${currentDate}'
              AND t_user_properties.date_effet_end > '${currentDate}'`

        const sousEquipes = await sequelize.query(selectUserEquipeQuery, { type: QueryTypes.SELECT })

        if(sousEquipes.length === 0){
            throw new NotFoundError('Sous-équipe non trouvée')
        }

        if(sousEquipes.length > 1) {
            throw new Error(`Cet utilisateur est rattaché à plusieurs sous-équipes: ${sousEquipes.map((equipe: any) => equipe.num_equipe).join(' ').trim().split(' ')}` )
        }

        const selectEquipeEmployeesQuery = `select id, nom_complet from t_user, t_user_properties where
            t_user_properties.t_user_id = t_user.id
            AND t_user_properties.t_equipe_id = ${sousEquipes[0]['id']}
            AND t_user_properties.date_effet < '${currentDate}'
            AND t_user_properties.date_effet_end > '${currentDate}'`

        const users = await sequelize.query(selectEquipeEmployeesQuery, { type: QueryTypes.SELECT })

        return {sousEquipe: sousEquipes[0], users}
    }

    static async getSousEquipePlanning(sousEquipe: any[], saturday: string, allCodesAbsence: string[]){
        const insertedCodeHrs = await Promise.all(
            ([...new Set(sousEquipe.map((item: any) => item.id))] as number [])
              .map(item => Service.getWeeklyUserPlanning(saturday, item)
              )
          )

          const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          const result = insertedCodeHrs.map((user: []) => user.reduce((acc: {[key: string]: any}, cur: any)=> {
              const codeJSObj = cur.ALIAS_CODE_JS_FINAL.id ? cur.ALIAS_CODE_JS_FINAL : cur.ALIAS_CODE_JS_PREVISIONNEL
              const duration = getDurationFromMSec(codeJSObj.duree_journee - codeJSObj.duree_coupures - codeJSObj.duree_pauses )
              return {
                  ...acc,
                  name: cur.t_user.nom_complet,
                  status: !!cur.ALIAS_CODE_JS_FINAL ? 'Non Saisi' : 'Non saisi', // TODO differentiate between Non Saisi and Saisi
                  [days[new Date(cur.date).getDay()]]: {
                      date: cur.date,
                      'value': allCodesAbsence.includes(codeJSObj.code_hour) ? codeJSObj.code_hour : Object.values(duration).map(t => `${t}`.padStart(2, '0')).join(':'),
                      'codeJS': codeJSObj.code_hour,
                      'timeSlots': codeJSObj.range_slots_hourlybreak,
                      'totalTime': Object.values(getDurationFromMSec(codeJSObj.duree_journee)).map((n: number) => `${n}`.padStart(2, '0')).join(':'),
                      'chantiers': [
                          'VFFFV20 - Réparation caténaire - 04:00'
                      ]
                  }
              }
          }, {}))


          return result
    }

    static getAllCodeAbsence = (ets) => {
      const q = `SELECT code_hour FROM t_code_hours_absence where code_t_etablissement='${ets}' and id_t_compte IS NOT NULL`
      return sequelize.query(q, { type: QueryTypes.SELECT })
    }

    static getWeeklyUserPlanning = async (date: string, employeeId: number) => {

        const startDate = new Date(date)
        startDate.setDate(startDate.getDate() - 1)

        const maxDate = new Date(date)
        maxDate.setDate(maxDate.getDate() + 6)

        const planningQuery = `SELECT "planning"."id", "planning"."id_t_user", "planning"."date", "planning"."id_t_code_hours_prevision", "planning"."id_t_code_hours_final", "t_user"."id" AS "t_user.id", "t_user"."nom_complet" AS "t_user.nom_complet", "ALIAS_CODE_JS_PREVISIONNEL"."id" AS "ALIAS_CODE_JS_PREVISIONNEL.id", "ALIAS_CODE_JS_PREVISIONNEL"."code_hour" AS "ALIAS_CODE_JS_PREVISIONNEL.code_hour", "ALIAS_CODE_JS_PREVISIONNEL"."duree_pauses" AS "ALIAS_CODE_JS_PREVISIONNEL.duree_pauses", "ALIAS_CODE_JS_PREVISIONNEL"."duree_coupures" AS "ALIAS_CODE_JS_PREVISIONNEL.duree_coupures", "ALIAS_CODE_JS_PREVISIONNEL"."duree_journee" AS "ALIAS_CODE_JS_PREVISIONNEL.duree_journee", "ALIAS_CODE_JS_PREVISIONNEL"."code_t_etablissement" AS "ALIAS_CODE_JS_PREVISIONNEL.code_t_etablissement", "ALIAS_CODE_JS_PREVISIONNEL"."range_slots_hourlybreak" AS "ALIAS_CODE_JS_PREVISIONNEL.range_slots_hourlybreak", "ALIAS_CODE_JS_FINAL"."id" AS "ALIAS_CODE_JS_FINAL.id", "ALIAS_CODE_JS_FINAL"."code_hour" AS "ALIAS_CODE_JS_FINAL.code_hour", "ALIAS_CODE_JS_FINAL"."duree_pauses" AS "ALIAS_CODE_JS_FINAL.duree_pauses", "ALIAS_CODE_JS_FINAL"."duree_coupures" AS "ALIAS_CODE_JS_FINAL.duree_coupures", "ALIAS_CODE_JS_FINAL"."duree_journee" AS "ALIAS_CODE_JS_FINAL.duree_journee", "ALIAS_CODE_JS_FINAL"."code_t_etablissement" AS "ALIAS_CODE_JS_FINAL.code_t_etablissement", "ALIAS_CODE_JS_FINAL"."range_slots_hourlybreak" AS "ALIAS_CODE_JS_FINAL.range_slots_hourlybreak" FROM "planning" AS "planning" INNER JOIN "t_user" AS "t_user" ON "planning"."id_t_user" = "t_user"."id" INNER JOIN "t_code_hours_absence" AS "ALIAS_CODE_JS_PREVISIONNEL" ON "planning"."id_t_code_hours_prevision" = "ALIAS_CODE_JS_PREVISIONNEL"."id" LEFT OUTER JOIN "t_code_hours_absence" AS "ALIAS_CODE_JS_FINAL" ON "planning"."id_t_code_hours_final" = "ALIAS_CODE_JS_FINAL"."id" WHERE "planning"."date" >= '${startDate.toJSON()}' AND "planning"."date" < '${maxDate.toJSON()}' AND "planning"."id_t_user" = ${employeeId} LIMIT 7;`
        return await sequelize.query(planningQuery, { type: QueryTypes.SELECT, nest: true })
    }
}
export default Service
