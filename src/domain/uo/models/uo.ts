/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

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
  t_uo_code_parent: {
    type: DataTypes.STRING(45)
  },
  date_effet_parent: {
    type: DataTypes.DATE
  },
  date_active: {
    type: DataTypes.DATE
  },
  t_departement_code: {
    type: DataTypes.STRING(45)
  },
  date_effet_departement: {
    type: DataTypes.STRING(45)
  },
  t_etablissement_code: {
    type: DataTypes.STRING(45)
  },
  date_effet_etablissement: {
    type: DataTypes.DATE
  },
  t_type_uo_code: {
    type: DataTypes.STRING(45)
  },
  libelle: {
    type: DataTypes.STRING(30)
  },
  libelle_min: {
    type: DataTypes.STRING(10)
  },
  code_societe: {
    type: DataTypes.STRING(45)
  },
  enabled: {
    type: DataTypes.TINYINT
  },
  search: {
    type: DataTypes.TEXT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class UO extends Model {}
UO.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_uo',
  timestamps: false
})

export default UO
