/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  t_compte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  }
}

class CompteVisible extends Model {}
CompteVisible.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_compte_visible',
  timestamps: false
})

export default CompteVisible
