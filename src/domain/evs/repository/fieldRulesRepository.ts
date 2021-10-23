/* eslint-disable @typescript-eslint/camelcase */
//import paginate from '../../util/database'
import models from '../..'
import EvsFieldRules from '../models/fieldRulesModel'
import data from '../models/fieldRulesDefault.json'
import GroupSettingsRepository from './groupSettingsRepository'
import GroupSettingsRapportRepository from './groupSettingsRapportRepository'

class Repository {
  static async findAll(choix: number, etablissementCode: string): Promise<any> {
    let result: any

    let criteria = {}
    if (choix == 1) {
      criteria = {
        where: {
          t_etablissement_code: etablissementCode,
          display_in_settings: 1,
          enable_in_settings: 1
        }
      }

      result = await models.EvsGroupSettings.findAndCountAll({
        include: [
          {
            ...criteria,
            model: models.EvsFieldRules,
            order: ['position_in_settings', 'ASC']
          }
        ],
        order: [
          ['position', 'ASC'],
          ['libelle', 'ASC'],
          [models.EvsFieldRules, 'position_in_settings', 'ASC']
        ],
        raw: false,
        nest: true
      })
    } else {
      criteria = {
        where: {
          t_etablissement_code: etablissementCode,
          display_in_rapport: 1,
          enable_in_rapport: 1
        }
      }
      result = await models.EvsGroupRapport.findAndCountAll({
        include: [
          {
            ...criteria,
            model: models.EvsFieldRules
          }
        ],
        order: [
          ['position', 'ASC'],
          ['libelle', 'ASC'],
          [models.EvsFieldRules, 'position_in_rapport', 'ASC']
        ],
        raw: false,
        nest: true
      })
    }

    return result
  }

  static async update(evsFieldRules: any) {
    return EvsFieldRules.update(evsFieldRules, {
      where: {
        id_field: evsFieldRules.id_field,
        t_etablissement_code: evsFieldRules.t_etablissement_code
      }
    })
  }

  static async updatePosition(evsFieldRules: any) {
    let obj = {}
    if (evsFieldRules.forSettings === 1) {
      obj = { position_in_settings: evsFieldRules.position_in_settings }
    } else {
      obj = { position_in_rapport: evsFieldRules.position_in_settings }
    }
    return EvsFieldRules.update(obj, {
      where: { id_field: evsFieldRules.id_field }
    })
  }

  static async add(evsFieldRules: any) {
    return EvsFieldRules.create(evsFieldRules)
  }

  static async findOneByCode(id_field: string) {
    return EvsFieldRules.findOne({ raw: true, where: { id_field: id_field } })
  }

  static async setDefaultValues(codeEtablissement: string) {
    const result = await this.findAll(1, codeEtablissement)
    if (result.rows === 0) {
      return
    }
    for (const key in data) {
      // check if the property/key is defined in the object itself, not in parent
      const value = data[key]
      let groupSettingsId
      let groupRapportId
      const fieldRules = await this.findOneByCode(key).catch(err =>
        console.error(err)
      )
      if (!fieldRules) {
        //let obj
        //Case of field without group
        if (!value.data) {
          //const obj = this.adaptFieldRules(data[key], key)
          //this.add(obj)
        } else {
          //In the case of a field embeded in group
          for (const subKey in value.data) {
            const grpData: any = this.adaptGroup(data[key].libelle, key)
            const fieldData: any = this.adaptFieldRules(
              value.data[subKey],
              subKey
            )

            //only add if Grp doesn't exist

            if (fieldData.display_in_settings) {
              groupSettingsId = await GroupSettingsRepository.add(
                grpData,
                codeEtablissement
              )
              groupSettingsId = groupSettingsId.id
            }
            if (fieldData.display_in_rapport) {
              groupRapportId = await GroupSettingsRapportRepository.add(
                grpData,
                codeEtablissement
              )
              groupRapportId = groupRapportId.id
            }

            await this.add({
              ...fieldData,
              t_etablissement_code: codeEtablissement,
              t_evs_group_rapport_id: groupRapportId,
              t_evs_group_settings_id: groupSettingsId
            })
          }
        }
      }
    }
  }

  /**
   * This function is to reset a field rule to default settings
   * @param codeEtablissement
   * @param fieldId
   */
  static async resetField(
    codeEtablissement: string,
    fieldId: string,
    grp: string
  ) {
    // check if the property/key is defined in the object itself, not in parent
    const value = data[fieldId] || data[grp]
    const fieldRules: any = await this.findOneByCode(fieldId)
    if (fieldRules && value) {
      //let obj
      //Case of field without group

      //In the case of a field embeded in group

      const object = value.data ? value.data[fieldId] : value

      const fieldData: any = this.adaptFieldRules(object, fieldId)

      try {
        await EvsFieldRules.destroy({
          where: {
            id_field: fieldId,
            t_etablissement_code: codeEtablissement
          }
        })
      } catch (err) {
        console.error(err)
      }

      return this.add({
        ...fieldData,
        t_etablissement_code: codeEtablissement,
        t_evs_group_rapport_id: fieldRules.t_evs_group_rapport_id,
        t_evs_group_settings_id: fieldRules.t_evs_group_settings_id
      })
    }
  }

  static adaptFieldRules(data: any, key: string) {
    return {
      id_field: key,
      libelle: data.libelle,
      display_in_rapport: data.display_in_rapport,
      display_in_settings: data.display_in_settings,
      enable_in_rapport: data.enable_in_rapport,
      enable_in_settings: data.enable_in_settings,
      libelle_rapport: data.libelle,
      libelle_settings: data.libelle
    }
  }

  static adaptGroup(libelle: string, key) {
    return {
      grp: key,
      libelle: libelle
    }
  }
}

export default Repository
