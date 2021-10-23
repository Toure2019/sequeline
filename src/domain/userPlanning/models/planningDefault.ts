/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  code_hour: {
    type: DataTypes.STRING,
    allowNull: false
  },
  old: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  }
}

class PlanningDefault extends Model {}

PlanningDefault.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_planning_default',
  timestamps: false
})

export default PlanningDefault
