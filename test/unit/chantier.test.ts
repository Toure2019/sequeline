/* eslint-disable @typescript-eslint/camelcase */
import service from '../../src/domain/chantier/service/chantier'
import repository from '../../src/domain/chantier/repository/Chantier'
//import RessourceChantierService from '../../src/domain/chantier/service/enginChantier'
import { resetDB } from '../utils/db'
import { insertChantierFixtures } from '../fixtures/chantier'

beforeAll(async () => {
  await resetDB()

  await insertChantierFixtures()
})
describe('check if repository and service layers work properly for Chantier domain', () => {
  it('expect chantier to be correctly added if object and edited is valid', async done => {
    let chantier: any = {
      annee: 2020,
      num_semaine: 6,
      t_compte_id: 1,
      t_compte_erp_id: 1,
      t_segment_gestion_id: -1,
      t_cpr_id: 1,
      client_link: '',
      t_engin_id: -1,
      rg_pointage: '',
      axe_local: '',
      t_equipe_id: 1,
      t_user_id: 1
    }

    chantier = await repository.add(chantier)
    chantier = await repository.findOneById(chantier.id)
    chantier = chantier.toJSON()
    expect(chantier).not.toBeNull()
    expect(chantier.annee).toEqual('2020')
    expect(chantier.num_semaine).toEqual('6')
    await repository.update({ ...chantier, num_semaine: '7' })
    chantier = await service.findOneById(chantier.id)
    chantier = chantier.toJSON()
    expect(chantier.num_semaine).toEqual('7')
    done()
  }),
    // it('expect result', async done => {
    //   const result = await service.findAll(1, 50, 'id', 'asc', ['1'], 1, 2020)
    //   expect(result.rows.length).toBeGreaterThanOrEqual(0)
    //   done()
    // }),
    it('validator should return error', async done => {
      const chantier: any = {
        id: 1,
        num_semaine: null,
        annee: null
      }
      const result = await service.validateRequest(chantier)
      expect(result.error).not.toBeNull()
      done()
    })
})
// Non fonctionnelle car la table t_engin_inter_chantier n'est pas crée

/*describe('check if repository and service layers work properly for Chantier ressource domain', () => {
  it('expect chantier to be correctly added if object and edited is valid', async done => {
    let chantier: any = {
      annee: 2020,
      num_semaine: 6,
      t_compte_id: 1,
      t_compte_erp_id: 1,
      t_segment_gestion_id: -1,
      t_cpr_id: 1,
      client_link: '',
      t_engin_id: -1,
      rg_pointage: '',
      axe_local: '',
      t_equipe_id: 1,
      t_user_id: 1
    }

    chantier = await repository.add(chantier)
    chantier = await repository.findOneById(chantier.id)
    chantier = chantier.toJSON()
    expect(chantier).not.toBeNull()
    expect(chantier.annee).toEqual('2020')
    expect(chantier.num_semaine).toEqual('6')
    
    const ressources = [];
    for (let i = 0; i < 5; i++) {
      const ressourceChantier = {
        t_inter_chantier_id: chantier.id,
        t_engin_id: i,
        date: '2020-09-30',
        value: '07:00'
      }
      ressources.push(ressourceChantier);
    }
    await RessourceChantierService.addListRessources(chantier.id, ressources);
    let chantierLoaded = await service.getDetailChantierDurationForUsers(1, chantier.id, '2020-09-30');
    expect(chantierLoaded.engins).not.toBeUndefined()
    expect(chantierLoaded.engins).not.toBeNull()
    expect(chantierLoaded.engins).toHaveLength(5)

    await RessourceChantierService.removeListRessources(chantier.id)
    chantierLoaded = await service.getDetailChantierDurationForUsers(1, chantier.id, '2020-09-30');
    expect(chantierLoaded.engins).toHaveLength(0)

    done()
  })
})*/
// Requete non fonctionnelle sur sqlite
//describe('check data collect for data calc chantier', () => {
//it('expect result for get duration', async done => {
//  const result = await service.getDuration(1)
//  expect(result).toBeTruthy()
//  expect(result).toEqual(36000)
//  done()
//}),
//})
