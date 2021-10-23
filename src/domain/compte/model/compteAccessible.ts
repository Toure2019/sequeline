/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  bupc: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  projet: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  activite: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  t_rg_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  date_effet_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class CompteAccessible extends Model {}
CompteAccessible.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_compte_accessible',
  timestamps: false
})

export default CompteAccessible
