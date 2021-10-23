/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_effet_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ecc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bupc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bupc_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  projet_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activite_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  projet_date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  activite_date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  projet_statut: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  activite_statut: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  localisable: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class CompteErp extends Model {}
CompteErp.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_compte_erp',
  timestamps: false
})

export default CompteErp
