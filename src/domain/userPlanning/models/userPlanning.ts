/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  update_manual: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  code_hour_recup: {
    type: DataTypes.STRING,
    allowNull: true
  },
  old: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  detach: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  t_uo_code_detach: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration_detach: {
    type: DataTypes.TIME,
    allowNull: true
  }
}

class UserPlanning extends Model {}

UserPlanning.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_planning',
  timestamps: false
})

export default UserPlanning
