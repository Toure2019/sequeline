/* eslint-disable @typescript-eslint/camelcase */
import Repository from './repository'
import schema from './schema'
import { get422Error, DATEFORMAT, now } from '../../util/util'
import DB from '../../database/connection'
import UserService from '../user/service/user'
import ChantierService from '../chantier/service/chantier'

class Service {
    static async validateRequest(data: any) {
        const response = schema.validate(data)
        const result = response.value
        let error = null
    
        if (response.error) {
          error = get422Error(response)
        }
    
        return { result, error }
      }

  static async findAll(chantierId, date?): Promise<any> {
    return await this.adapt(await Repository.findAll(chantierId, date))
  }

  static async adapt(rapports) {
    const result = []
    if (rapports && rapports.length > 0) {
        for (const rap of rapports) {
            const data = {
                id: rap.id,
                date_rapport: rap.date_rapport,
                t_inter_chantier_id: rap.t_inter_chantier_id,
                date_update: rap.date_update,
                t_user_id: rap.t_user_id,
                user: await UserService.findOneUserById(rap.t_user_id),
                photos_delete: rap.photos_delete,
                set_auto: rap.set_auto,
                datas: await Repository.findDataRapport(rap.id)
            }
            result.push(data)
        }
    }
    return result
  }

  static async deleteRapports(chantierId: number, date: string) {
    const transaction = await DB.transaction()
    try {
      await Repository.deleteRapports(chantierId, date, transaction)
      await Repository.deleteRapportsData(chantierId, date, transaction)
      transaction.commit()
      return true
    } catch (err) {
        // Rollback transaction only if the transaction object is defined
        console.error(err)
        if (transaction) await transaction.rollback()
    }
  }

  static async upsertRapport(rapport: any): Promise<any> {
    const transaction = await DB.transaction()
    try {
        const toUpsert = {
            id: rapport.id,
            date_rapport: rapport.date_rapport,
            t_inter_chantier_id: rapport.t_inter_chantier_id,
            t_user_id: rapport.t_user_id
        }
        const rapportUpsert: any = await Repository.upsert(toUpsert, transaction)
        const idRapport = rapportUpsert.id ? rapportUpsert.id : rapport.id
        const rapportDatas = this.getRapportsData(idRapport, rapport)
        await Repository.updateRapportDatas(idRapport, rapportDatas, transaction)
        const chantierDataCalc = await ChantierService.processChantierDataCalc(await ChantierService.findOneById(rapport.t_inter_chantier_id), null, true, transaction)
        await ChantierService.updateDataCalc(chantierDataCalc, transaction)
        transaction.commit()
        return rapportUpsert
    } catch (err) {
        // Rollback transaction only if the transaction object is defined
        console.error(err)
        if (transaction) await transaction.rollback()
    }
  }
  
  static getRapportsData(id, rapport) {
    const rapportDatas = []
    rapportDatas.push(this.getDataRapportRow(id, rapport, 20, rapport.voie))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 7, rapport.kmDebut))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 8, rapport.kmFin))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 3, rapport.uop))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 4, rapport.observation))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 6, rapport.motif))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 21, rapport.attachement))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 14, JSON.stringify(rapport.ressourceEntreprise.filter((e) => e.value !== ''))))
    rapportDatas.push(this.getDataRapportRow(id, rapport, 16, JSON.stringify(rapport.ressourceEntrepriseExt.filter((e) => e.value !== ''))))
    rapport.procedures.forEach((e) => {
        rapportDatas.push(this.getDataRapportRow(id, rapport, 9, JSON.stringify(e)))
    })
    rapport.activites.forEach((e) => {
        rapportDatas.push(this.getDataRapportRow(id, rapport, 18, JSON.stringify(e)))
    })
    rapportDatas.push(this.getDataRapportRow(id, rapport, 17, rapport.extautres))
    return rapportDatas
  }

  static getDataRapportRow(id, rapport, idField, value) {
      return {
        t_rapport_inter_chantier_id: id,
        date_rapport: rapport.date_rapport,
        t_inter_chantier_id: rapport.t_inter_chantier_id,
        t_field_rapport_id: idField,
        value: value,
        date_update_field: now(DATEFORMAT)
      }
  }

}

export default Service
