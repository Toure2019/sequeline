/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_inter_chantier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nbr_uop: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  nbr_uop_spot: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  check_rapport: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  cpr: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nbr_uop_days: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rapport_days: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration_days: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nbr_uop_days_spot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration_days_spot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ventilation_days_spot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration_spot: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ventilation_spot: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  spot_exist: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  duration_spot_reel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  duration_spot_gamme: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  rg_pointage: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  axe_local: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
}

class ChantierDataCalc extends Model {}
ChantierDataCalc.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_chantier_data_calc',
  timestamps: false
})

export default ChantierDataCalc
