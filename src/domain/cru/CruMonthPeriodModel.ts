/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  mois: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  num_semaines: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class CruMonthPeriod extends Model {}
CruMonthPeriod.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_cru_month_period',
  timestamps: false
})

export default CruMonthPeriod
