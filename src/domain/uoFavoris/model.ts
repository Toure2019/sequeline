/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  t_table: {
    type: DataTypes.STRING(45),
    primaryKey: true,
    unique: false
  },
  t_table_id: {
    type: DataTypes.STRING(45),
    primaryKey: true,
    unique: false
  },
  t_uo_code: {
    type: DataTypes.STRING(45),
    primaryKey: true,
    unique: false
  },
  t_etablissement_code: {
    type: DataTypes.STRING(45),
    primaryKey: true,
    unique: false
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class UoFavoris extends Model {
  public t_table: string
  public t_table_id: string
  public t_uo_code: string
  public t_etablissement: string
}
UoFavoris.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_favoris_uo',
  timestamps: false
})

export default UoFavoris
