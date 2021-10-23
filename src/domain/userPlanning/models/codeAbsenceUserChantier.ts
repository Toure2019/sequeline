/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  t_code_absence_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  duration: {
    type: DataTypes.TIME,
    allowNull: true
  }
}

class CodeAbsenceUserChantier extends Model {}

CodeAbsenceUserChantier.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_code_absence_user_chantier',
  timestamps: false
})

export default CodeAbsenceUserChantier
