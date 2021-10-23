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
  t_user_planning_date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  t_user_planning_t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  start: {
    type: DataTypes.TIME,
    allowNull: true
  },
  end: {
    type: DataTypes.TIME,
    allowNull: true
  }
}

class HoursUserPlanning extends Model {}

HoursUserPlanning.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_hours_user_planning',
  timestamps: false
})

export default HoursUserPlanning
