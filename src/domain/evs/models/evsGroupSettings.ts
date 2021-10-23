/* eslint-disable @typescript-eslint/camelcase */
import { Model } from 'sequelize'
import { modelFields } from './evsGroupRapport'
import sequelize from '../../../database/connection'

class EvsGroupSettings extends Model {}
EvsGroupSettings.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_evs_group_settings',
  timestamps: false
})

export default EvsGroupSettings
