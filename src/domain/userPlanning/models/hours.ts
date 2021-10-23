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
  code_hour: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start: {
    type: DataTypes.TIME,
    allowNull: true
  },
  end: {
    type: DataTypes.TIME,
    allowNull: true
  },
  t_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class Hours extends Model {}

Hours.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_hours',
  timestamps: false
})

export default Hours
