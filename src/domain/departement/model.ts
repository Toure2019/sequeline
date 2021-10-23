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
  date_update: {
    type: DataTypes.DATE
  },
  t_rg_code: {
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

class Departement extends Model {
  public code: string
  public date_effet: Date
  public date_effet_end: Date
  public libelle: string
  public libelle_min: string
  public t_rg_code: string
  public enabled: number
  public version: Date
}
Departement.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_departement',
  timestamps: false
})

export default Departement
