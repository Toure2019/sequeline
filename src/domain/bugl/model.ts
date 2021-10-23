/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  code: {
    type: DataTypes.STRING(5),
    primaryKey: true
  },
  libelle: {
    type: DataTypes.STRING(30)
  },
  libelle_min: {
    type: DataTypes.STRING(10)
  },
  enabled: {
    type: DataTypes.TINYINT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class Bugl extends Model {}
Bugl.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_bugl',
  timestamps: false
})

export default Bugl
