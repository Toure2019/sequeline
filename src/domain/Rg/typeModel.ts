/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  t_rg_code: {
    type: DataTypes.STRING(45),
    primaryKey: true
  },
  rg_type: {
    type: DataTypes.STRING(45),
    primaryKey: true
  },

  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class RgData extends Model {}
RgData.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_rg_data',
  timestamps: false
})

export default RgData
