/* eslint-disable @typescript-eslint/camelcase */
import models from '../../src/domain'

export const insertChantierFixtures = async () => {
  const chantiers = []
  //const userChantiers = []
  //const dateChantier = now(DATEFORMAT)


  for (let i = 0; i < 5; i++) {
    const chantier = {
      id: i,
      t_compte_id: 1,
      t_compte_erp_id: 1,
      num_semaine: i+1,
      annee: '2020',
      t_user_id: 1,
      t_equipe_id: 1,
      t_segment_gestion_id: -1,
      t_cpr_id: 1,
      client_link: '',
      t_engin_id: -1,
      rg_pointage: '',
      axe_local: ''
    }

    //const userChantier = {
    //  t_inter_chantier_id: 1,
    //  t_user_planning_date: dateChantier,
    //  t_user_planning_t_user_id: i,
    //  duration: '0'+i+':00:00',
    //}

    chantiers.push(chantier)
    //userChantiers.push(userChantier)
  }

  //await models.UserChantier.bulkCreate(userChantiers)
  await models.Chantier.bulkCreate(chantiers)
}
