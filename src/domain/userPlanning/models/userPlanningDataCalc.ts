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
  planning_code_hour: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  planning_duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  planning_duration_reel: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dispo_duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dispo_duration_spot_ventil: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_detach: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_special_night: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_derangement: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  code_recup: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ecart_alert: {
    type: DataTypes.STRING,
    allowNull: true
  },
  evs_state: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  need_help_take_repos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  need_entretien: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}

class UserPlanningDataCalc extends Model {}

UserPlanningDataCalc.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_planning_data_calc',
  timestamps: false
})

export default UserPlanningDataCalc
