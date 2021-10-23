/* eslint-disable @typescript-eslint/camelcase */
//import paginate from '../../util/database'
import models from '../..'
import moment from 'moment'
import { Op } from 'sequelize'

class Repository {
  static async findAll(date: string, userId: string): Promise<any> {
    const startWeek = moment(date, 'YYYY-MM-DD')
    .tz('Europe/Paris')
    .startOf('week').format('YYYY-MM-DD HH:mm:ss')
    const endWeek = moment(date, 'YYYY-MM-DD')
    .tz('Europe/Paris')
    .endOf('week').format('YYYY-MM-DD HH:mm:ss')
    
    return await models.Evs.findAll({
        include: [{
         model: models.EvsData,
         attributes: [
          'key', 
          'value', 
        ],
         where: {
           t_user_id: userId
         }
        },
        {
          model: models.EvsWeek,
          attributes: [
            'need_help_take_repos', 
            'need_entretien', 
            'indemn_surcroit_trav_excep', 
            'pref_be_payed'
          ],
          where: {
            num_semaine: moment(date, 'YYYY-MM-DD')
            .tz('Europe/Paris').week(),
            annee: moment(date, 'YYYY-MM-DD')
            .tz('Europe/Paris').year()
          }
         }],
        attributes: {
          exclude: [
                    'update_t_user_id', 
                    'update_t_role_id', 
                    'check_evs', 
                    'clos', 
                    'date_cloture', 
                    'cloture_t_user_id',
                    't_user_id',
                    'date',
                    'date_update'
                   ]
        },
        where: {
          t_user_id: userId,
          date: {
            [Op.between] : [startWeek, endWeek]
          },
        },
        order: [
          ['date', 'ASC'],
        ],
        raw: false,
        nest: true
      })
  }


  static async findAllEvsForDuplicate(date: string, userId: string, transaction): Promise<any> {
    const startWeek = moment(date, 'YYYY-MM-DD')
    .tz('Europe/Paris')
    .startOf('week').format('YYYY-MM-DD HH:mm:ss')
    const endWeek = moment(date, 'YYYY-MM-DD')
    .tz('Europe/Paris')
    .endOf('week').format('YYYY-MM-DD HH:mm:ss')
    
    return await models.Evs.findAll({
        where: {
          t_user_id: userId,
          date: {
            [Op.between] : [startWeek, endWeek]
          },
        },
        order: [
          ['date', 'ASC'],
        ],
        raw: true,
        nest: true,
        transaction
      })
  }

  static async findAllEvsDataForDuplicate(date: string, userId: string, transaction): Promise<any> {
    const startWeek = moment(date, 'YYYY-MM-DD')
    .tz('Europe/Paris')
    .startOf('week').format('YYYY-MM-DD HH:mm:ss')
    const endWeek = moment(date, 'YYYY-MM-DD')
    .tz('Europe/Paris')
    .endOf('week').format('YYYY-MM-DD HH:mm:ss')
    
    return await models.EvsData.findAll({
        where: {
          t_user_id: userId,
          date: {
            [Op.between] : [startWeek, endWeek]
          },
        },
        order: [
          ['date', 'ASC'],
        ],
        raw: true,
        nest: true,
        transaction
      })
  }

  static async findAllEvsWeekForDuplicate(date: string, userId: string, transaction): Promise<any> {
    
    return await models.EvsWeek.findAll({
        where: {
          t_user_id: userId,
          num_semaine: moment(date, 'YYYY-MM-DD')
          .tz('Europe/Paris').week(),
          annee: moment(date, 'YYYY-MM-DD')
          .tz('Europe/Paris').year()
        },
        raw: true,
        nest: true,
        transaction
      })
  }

  static async addListEvs(data, transaction) {
    return await models.Evs.bulkCreate(data, { ignoreDuplicates: true, transaction })
  }

  static async addListEvsData(data, transaction) {
    return await models.EvsData.bulkCreate(data, { ignoreDuplicates: true, transaction })
  }

  static async addListEvsWeek(data, transaction) {
    return await models.EvsWeek.bulkCreate(data, { ignoreDuplicates: true, transaction })
  }

  static async removeListEvs(userId: number, date: string, transaction) {
      const startWeek = moment(date, 'YYYY-MM-DD')
      .tz('Europe/Paris')
      .startOf('week').format('YYYY-MM-DD HH:mm:ss')
      const endWeek = moment(date, 'YYYY-MM-DD')
      .tz('Europe/Paris')
      .endOf('week').format('YYYY-MM-DD HH:mm:ss')
      return await models.Evs.destroy({
        where: {
          t_user_id: userId,
          date: {
            [Op.between] : [startWeek, endWeek]
          },
        },
        transaction
      })
  }

  static async removeListEvsData(userId: number, date: string, transaction) {
      const startWeek = moment(date, 'YYYY-MM-DD')
      .tz('Europe/Paris')
      .startOf('week').format('YYYY-MM-DD HH:mm:ss')
      const endWeek = moment(date, 'YYYY-MM-DD')
      .tz('Europe/Paris')
      .endOf('week').format('YYYY-MM-DD HH:mm:ss')
      return await models.EvsData.destroy({
        where: {
          t_user_id: userId,
          date: {
            [Op.between] : [startWeek, endWeek]
          },
        },
        transaction
      })
  }

  static async removeListEvsWeek(userId: number, date: string, transaction) {
      return await models.EvsWeek.destroy({
        where: {
          t_user_id: userId,
          num_semaine: moment(date, 'YYYY-MM-DD')
          .tz('Europe/Paris').week(),
          annee: moment(date, 'YYYY-MM-DD')
          .tz('Europe/Paris').year()
        },
        transaction
      })
  }

  static async upsertData(evsData: any) {
    const evsWeektoUP = {...evsData[0].t_evs_week}
    const evsWeek = await models.EvsWeek.findOne({ where: { annee: evsWeektoUP.annee, 
      num_semaine: evsWeektoUP.num_semaine, t_user_id: evsWeektoUP.t_user_id  }})
    if (!evsWeek) {
      await models.EvsWeek.create(evsWeektoUP)
    } else {
      await models.EvsWeek.update(evsWeektoUP, {where: { annee: evsWeek.annee, 
        num_semaine: evsWeek.num_semaine, t_user_id: evsWeek.t_user_id  }})
    }
    for (let dataUp of evsData) {
      for (const evsDataUp of dataUp.t_evs_data) {
        const TevsData = await models.EvsData.findOne({ where: { date: evsDataUp.date, 
          key: evsDataUp.key, t_user_id: evsDataUp.t_user_id  }})
        if (!TevsData) {
          await models.EvsData.create(evsDataUp)
        } else {
          await models.EvsData.update(evsDataUp, {where: { date: evsDataUp.date, 
            key: evsDataUp.key, t_user_id: evsDataUp.t_user_id  }})
        }
      }
      dataUp = {...dataUp,  ecart_relevage: dataUp.ecart_relevage.toString(), 
        ecart_prolongation_acc: dataUp.ecart_prolongation_acc.toString()}
      const data = await models.Evs.findOne({ where: { date: dataUp.date, 
        t_user_id: dataUp.t_user_id  }})
      if (!data) {
        await models.Evs.create(dataUp)
      } else {
        await models.Evs.update(dataUp, {where: { date: data.date, t_user_id: data.t_user_id  }})
      }
    }
  }
}

export default Repository
