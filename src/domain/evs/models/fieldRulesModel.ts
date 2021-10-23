/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  id_field: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  t_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  libelle_rapport: {
    type: DataTypes.STRING,
    allowNull: true
  },
  libelle_settings: {
    type: DataTypes.STRING,
    allowNull: true
  },
  display_in_settings: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  display_in_rapport: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enable_in_settings: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enable_in_rapport: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  position_in_settings: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  position_in_rapport: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  t_evs_group_rapport_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_evs_group_settings_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  version: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'CURRENT_TIMESTAMP'
  }
}

class EvsFieldRules extends Model {}
EvsFieldRules.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_evs_field_rules',
  timestamps: false
})

export default EvsFieldRules
