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
  t_type_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.DATE
  }
}

class CodeRessource extends Model {}
CodeRessource.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_code_ressource',
  timestamps: false
})

export default CodeRessource
