/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  t_compte_nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  t_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true
  },
  journalier: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '1'
  },
  duration: {
    type: DataTypes.TIME,
    allowNull: true
  },
  visible: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '1'
  }
}

class CodeAbsence extends Model {}
CodeAbsence.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_code_absence',
  timestamps: false
})

export default CodeAbsence
