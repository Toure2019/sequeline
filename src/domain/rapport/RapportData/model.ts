/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  t_rapport_inter_chantier_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_rapport: {
    type: DataTypes.DATE,
    allowNull: false
  },
  t_inter_chantier_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_field_rapport_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING(45)
  },
  date_update_field: {
    type: DataTypes.DATE
  }
}

class RapportData extends Model {}
RapportData.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_data_rapport',
  timestamps: false
})

export default RapportData