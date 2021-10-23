/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  t_etablissement_code: {
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
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class EtablissementData extends Model {}

EtablissementData.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_etablissement_data',
  timestamps: false
})

export default EtablissementData
