/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  libelle: {
    type: DataTypes.STRING(30)
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class Role extends Model {}
Role.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_role',
  timestamps: false
})

export default Role
