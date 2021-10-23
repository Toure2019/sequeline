/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  t_role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class UserRole extends Model {}
UserRole.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_roles',
  timestamps: false
})

export default UserRole
