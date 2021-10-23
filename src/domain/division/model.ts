/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  code: {
    type: DataTypes.STRING(45),
    primaryKey: true
  },
  date_effet: {
    type: DataTypes.DATE,
    primaryKey: true
  },
  date_effet_end: {
    type: DataTypes.DATE
  },
  t_bugl_code: {
    type: DataTypes.STRING(45)
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

class Division extends Model {}
Division.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_division',
  timestamps: false
})

export default Division
