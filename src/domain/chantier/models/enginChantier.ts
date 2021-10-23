/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_inter_chantier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  t_engin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.DATE
  }
}

class EnginChantier extends Model {}
EnginChantier.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_engin_inter_chantier',
  timestamps: false
})

export default EnginChantier
