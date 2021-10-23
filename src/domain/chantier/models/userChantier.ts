/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_inter_chantier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  t_user_planning_date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
  },
  t_user_planning_t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  duration: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  old: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0',
  },
}

class UserChantier extends Model {}
UserChantier.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_inter_chantier',
  timestamps: false,
})

export default UserChantier
