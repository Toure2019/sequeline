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
  libelle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  display: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  t_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class EvsGroupRapport extends Model {}
EvsGroupRapport.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_evs_group_rapport',
  timestamps: false
})

export default EvsGroupRapport
