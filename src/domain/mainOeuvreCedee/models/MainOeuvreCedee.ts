/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true
  },
  t_uo_code: {
    type: DataTypes.STRING,
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
  },
  commentaire: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class MainOeuvreCedee extends Model {}

MainOeuvreCedee.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_main_oeuvre_cd',
  timestamps: false
})

export default MainOeuvreCedee
