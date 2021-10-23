/* eslint-disable @typescript-eslint/camelcase */
import models from '../../index'
import paginate from '../../../util/database'
import DB from '../../../database/connection'
import { QueryTypes } from 'sequelize'
import { getDates, DAYNTERVAL } from '../../../util/util'
import moment from 'moment'
import Chantier from '../models/chantier'

class Repository {
  static async findAll(
    page: number,
    pageSize: number,
    orderByCol: string = 'id',
    direction: string = 'ASC',
    equipeId: string[],
    numSemaine: number,
    annee: number
  ): Promise<any> {
    const result: any = await models.Chantier.findAndCountAll({
      include: [
        { model: models.Compte },
        { model: models.CompteErp },
        { model: models.SegmentGestion },
        { model: models.ChantierDataCalc },
        { model: models.Engin, attributes: ['id', 'code', 'libelle'] }
      ],
      where: { t_equipe_id: equipeId, num_semaine: numSemaine.toString(), annee: annee.toString() },
      order: [[orderByCol, direction]],
      nest: true,
      raw: false,
      ...paginate(page, pageSize)
    })
    return {
      ...result,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static async findAllToDuplicate(
    equipeId: number,
    numSemaine: number,
    annee: number
  ): Promise<any> {
    return await models.Chantier.findAll({
      where: { t_equipe_id: equipeId, num_semaine: numSemaine.toString(), annee: annee.toString() },
      nest: true,
      raw: true,
    })
  }

  static async findAllUsersByChantier(chantierId: number): Promise<any> {
    const query1 = `select t_user_planning_t_user_id as id from t_user_inter_chantier where t_inter_chantier_id = '${chantierId}' group by t_user_planning_t_user_id`
    
    let result = []
    try {
      result = await DB.query(query1, {
        type: QueryTypes.SELECT,
        raw: true
      })
      result = result.map(item => {
        return item.id
      })
      const query2 = `select * from t_user where id in (${result})`
      result = await DB.query(query2, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }

  static async getDetailChantierDurations(
    chantierId: number,
    userId: number,
    date: string
  ): Promise<any> {
    const weekDates = getDates(
      moment(date)
        .tz('Europe/Paris')
        .startOf('week'),
      moment(date)
        .tz('Europe/Paris')
        .endOf('week'),
      DAYNTERVAL
    )

    const query = `select t_user_planning_date, duration as dur from t_user_inter_chantier INNER JOIN t_inter_chantier ON t_inter_chantier_id = t_inter_chantier.id 
                 where t_inter_chantier_id = '${chantierId}' 
                 and t_user_planning_t_user_id = '${userId}' and t_user_planning_date in (${weekDates.join(
      ','
    )})
                group by t_user_planning_date, duration order by t_user_planning_date asc;`

    let result = {}
    try {
      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }

  static async getDurationsByDay(
    chantierId: number,
    date: string
  ): Promise<any> {
    const weekDates = getDates(
      moment(date)
        .tz('Europe/Paris')
        .startOf('week'),
      moment(date)
        .tz('Europe/Paris')
        .endOf('week'),
      DAYNTERVAL
    )

    const query = `select t_user_planning_date, COALESCE(sum(TIMEDIFF('second', '00:00:00'::time, duration::time)),0) as dur from t_user_inter_chantier INNER JOIN t_inter_chantier ON t_inter_chantier_id = t_inter_chantier.id 
                 where t_inter_chantier_id = '${chantierId}' 
                and t_user_planning_date in (${weekDates.join(',')})
                group by t_user_planning_date order by t_user_planning_date asc;`

    let result: any = {}
    try {
      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }

  static async findCalcByChantier(
    page: number,
    pageSize: number,
    orderByCol: string = 't_inter_chantier_id',
    direction: string = 'ASC',
    chantierId
  ): Promise<any> {
    const result: any = await models.ChantierDataCalc.findAndCountAll({
      where: {
        t_inter_chantier_id: chantierId
      },
      order: [[orderByCol, direction]],
      raw: true,
      ...paginate(page, pageSize)
    })
    return {
      ...result,
      page,
      pageSize,
      recordsTotal: result.count,
      recordsFiltered: result.count
    }
  }

  static async findCalcByweekEquipes(
    equipe: any,
    semaine: number,
    annee: number
  ): Promise<any> {
    const chantierQuery = `select * from t_inter_chantier where num_semaine = '${semaine}' and annee = '${annee}' and t_equipe_id in (${equipe})`

    const selfFields = `tcdc.t_inter_chantier_id, tcdc.nbr_uop, tcdc.nbr_uop_spot, tcdc.duration, tcdc.duration_spot, tcdc.ventilation_spot, tcdc.check_rapport, tcdc.cpr, tcdc.axe_local, tcdc.rg_pointage, tcdc.version, 
            tcdc.nbr_uop_days, tcdc.nbr_uop_days_spot, tcdc.rapport_days, tcdc.duration_days, tcdc.duration_days_spot, tcdc.ventilation_days_spot, tic.t_compte_id, tic.num_semaine,tic.annee, 
            tic.t_equipe_id, tic.t_segment_gestion_id, tic.clos, tic.commentaire, tc.nom, tc.designation, tc.code_uop, tsg.code, tcdc.spot_exist, tcdc.duration_spot_reel, tcdc.duration_spot_gamme, 
            te.code as engin_code, te.libelle as engin_libelle, tdep.code as departement_client_code, tdep.libelle as departement_client_libelle `

    let result = []
    try {
      result = await DB.query(chantierQuery, {
        type: QueryTypes.SELECT,
        raw: true
      })
      result = result.map(item => {
        return item.id
      })

      const query2 = `select ${selfFields} from t_chantier_data_calc as tcdc 
                 inner join t_inter_chantier as tic on tcdc.t_inter_chantier_id = tic.id 
                 inner join t_compte as tc on tc.id = tic.t_compte_id 
                 left join t_segment_gestion as tsg on tsg.id = tic.t_segment_gestion_id 
                 left join t_engin as te on te.id = tic.t_engin_id 
                 left join t_departement as tdep on tdep.code = tic.client_link 
                 where t_inter_chantier_id in (${result})`
      result = await DB.query(query2, {
        type: QueryTypes.SELECT,
        raw: true
      })
    } catch (err) {
      console.error(err)
    }

    return result
  }

  static async update(chantier: any, transaction = null) {
    return models.Chantier.update(chantier, { where: { id: chantier.id }, transaction: transaction })
  }

  static async updateCommentaire(chantierId: number, commentaire: string) {
    return models.Chantier.update({ commentaire }, { where: { id: chantierId }})
  }

  static async delete(id: number) {
    return models.Chantier.destroy({ where: { id } })
  }

  static async findOneById(id: number) {
    return models.Chantier.findOne({ 
      where: { id },
      include: [
        { model: models.Compte },
        { model: models.CompteErp },
        { model: models.SegmentGestion },
        { model: models.ChantierDataCalc },
        { model: models.Engin, attributes: ['id', 'code', 'libelle'] }
      ],
      nest: true,
    })
  }

  static async add(chantier: any, transaction = null) {
    return Chantier.create(chantier, {transaction: transaction})
  }

  static async addDataCalc(chantierDataCalc: any, transaction = null) {
    return models.ChantierDataCalc.create(chantierDataCalc, {transaction: transaction})
  }

  static async updateDataCalc(chantierDataCalc: any, transaction = null) {
    return models.ChantierDataCalc.update(chantierDataCalc, { where: { t_inter_chantier_id: chantierDataCalc.t_inter_chantier_id }, transaction: transaction })
  }

  static async deleteDataCalc(id: number) {
    return models.ChantierDataCalc.destroy({ where: { t_inter_chantier_id: id } })
  }

  static async exist(chantier) {
    chantier.num_semaine = chantier.num_semaine.toString()
    chantier.annee = chantier.annee.toString()
   return models.Chantier.findOne({
      where: {
        annee: chantier.annee,
        num_semaine: chantier.num_semaine,
        t_compte_id: chantier.t_compte_id,
        t_segment_gestion_id: chantier.t_segment_gestion_id,
        t_cpr_id: chantier.t_cpr_id,
        client_link: chantier.client_link,
        t_engin_id: chantier.t_engin_id,
        rg_pointage: chantier.rg_pointage,
        axe_local: chantier.axe_local,
        t_equipe_id: chantier.t_equipe_id
      }
    })
  }

  static async getNbrUop(chantierId: number) {
    //TODO: ajout duration spot
    let result
    try {
      const query = `select COALESCE(sum(CAST(value as FLOAT)),0) as nbr_uop
                      from t_data_rapport
                      where t_inter_chantier_id = ${chantierId}
                      and t_field_rapport_id = '3';`

      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })

      return result
    } catch (err) {
      console.error(err)
    }
  }

  static async getDuration(chantierId: number) {
    //TODO: ajout duration spot
    let result
    try {
      const query = `select COALESCE(sum(TIMEDIFF('second', '00:00:00'::time, duration::time)),0) as dur 
                      from t_user_inter_chantier where t_inter_chantier_id = ${chantierId};`

      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })

      return result
    } catch (err) {
      console.error(err)
    }
  }

  static async getUserPlanningDates(chantierId: number) {
    let result
    try {
      const query = `select t_user_planning_date as date from t_user_inter_chantier 
                      where t_inter_chantier_id = ${chantierId} and duration <> '00:00:00' group by t_user_planning_date;`

      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })

      return result
    } catch (err) {
      console.error(err)
    }
  }

  static async getRapportPlanningDates(chantierId: number) {
    let result
    try {
      const query = `select date_rapport as date from t_rapport_inter_chantier 
                      where t_inter_chantier_id = ${chantierId} and set_auto = '0' group by date_rapport;`

      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })

      return result
    } catch (err) {
      console.error(err)
    }
  }

  static async getDataCalcNbrUop(chantierId: number, transaction?) {
    let result
    try {
      //and date_rapport in ".DB::getInRequestByArray($tabDate)
      const query = `select t_inter_chantier_id, date_rapport, COALESCE(sum(CAST(value as FLOAT)),0) as nbr_uop 
                      from t_data_rapport 
                      where t_inter_chantier_id = ${chantierId}
                      and t_field_rapport_id = '3' group by t_inter_chantier_id, date_rapport;`

      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true,
        transaction
      })

      return result
    } catch (err) {
      console.error(err)
    }
  }

  static async getDataCalcDuration(chantierId: number) {
    let result
    try {
      //and date_rapport in ".DB::getInRequestByArray($tabDate)
      const query = `select t_inter_chantier_id, t_user_planning_date, COALESCE(sum(TIMEDIFF('second', '00:00:00'::time, duration::time)),0) as dur
                      from t_user_inter_chantier
                      where t_inter_chantier_id = ${chantierId}
                      group by t_inter_chantier_id, t_user_planning_date;`

      result = await DB.query(query, {
        type: QueryTypes.SELECT,
        raw: true
      })

      return result
    } catch (err) {
      console.error(err)
    }
  }
}

export default Repository
