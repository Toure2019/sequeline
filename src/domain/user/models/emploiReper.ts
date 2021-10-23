/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_emploi_repere_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  t_type_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  t_code_ressource_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  date_effet_end: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '2150-01-01'
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class EmploiReperCodeRessource extends Model {}

EmploiReperCodeRessource.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_emploi_repere_code_ressource',
  timestamps: false
})

export default EmploiReperCodeRessource
