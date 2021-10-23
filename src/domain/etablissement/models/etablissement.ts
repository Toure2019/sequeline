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
  libelle: {
    type: DataTypes.STRING(30)
  },
  libelle_min: {
    type: DataTypes.STRING(10)
  },
  t_type_etablissement_code: {
    type: DataTypes.STRING(45)
  },
  t_categorie_etablissement_code: {
    type: DataTypes.STRING(45)
  },
  date_start: {
    type: DataTypes.DATE
  },
  date_end: {
    type: DataTypes.DATE
  },
  enabled: {
    type: DataTypes.TINYINT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class Etablissement extends Model {
  public code: string
  public date_effet: Date
  public date_effet_end: Date
  public libelle: string
  public libelle_min: string
  public t_type_etablissement_code: string
  public t_categorie_etablissement_code: string
  public date_start: Date
  public date_end: Date
  public enabled: number
  public version: Date
}

Etablissement.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_etablissement',
  timestamps: false
})

export default Etablissement
