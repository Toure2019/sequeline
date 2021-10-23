/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
}

class EvsData extends Model {}
EvsData.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_evs_data',
  timestamps: false
})

export default EvsData
