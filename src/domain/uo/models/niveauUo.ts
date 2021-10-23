/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class NiveauUo extends Model {}
NiveauUo.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_niveau_uo',
  timestamps: false
})

export default NiveauUo
