/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'

export const insertFieldRulesMock = async () => {
  const grpSettingsArr = []
  const grpRapportArr = []
  const fieldRulesArr = []

  for (let i = 0; i < 5; i++) {
    const grpSettingsCode = faker.random.number()
    const groupRapportCode = faker.random.number()

    const groupSettings = {
      id: grpSettingsCode,
      libelle: faker.random.word.name.toLowerCase(),
      grp: faker.random.word.name.toLowerCase(),
      t_etablissement_code: '0'
    }

    const groupRapport = {
      id: groupRapportCode,
      libelle: faker.random.word.name.toLowerCase(),
      grp: faker.random.word.name.toLowerCase(),
      t_etablissement_code: '0'
    }

    const fieldRule = {
      id_field: faker.random.word.name.toLowerCase(),
      t_etablissement_code: '0',
      t_evs_group_rapport_id: grpSettingsCode,
      t_evs_group_settings_id: grpSettingsCode
    }

    fieldRulesArr.push(fieldRule)
    grpSettingsArr.push(groupSettings)
    grpRapportArr.push(groupRapport)
  }

  await models.EvsGroupSettings.bulkCreate(grpSettingsArr)
  await models.EvsGroupRapport.bulkCreate(grpRapportArr)
  await models.EvsFieldRules.bulkCreate(fieldRulesArr)
}
