/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  libelle_min: {
    type: DataTypes.STRING,
    allowNull: false
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.DATE
  }
}

class EmploiRepere extends Model {}
EmploiRepere.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_emploi_repere',
  timestamps: false
})

export default EmploiRepere
