/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  t_niveau_uo_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  libelle_min: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class TypeUO extends Model {}
TypeUO.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_type_uo',
  timestamps: false
})

export default TypeUO
