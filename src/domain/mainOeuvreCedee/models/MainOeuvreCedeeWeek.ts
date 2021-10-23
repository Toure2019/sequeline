/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  num_semaine: {
    type: DataTypes.NUMBER,
    allowNull: false,
    primaryKey: true
  },
  annee: {
    type: DataTypes.NUMBER,
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
  commentaire: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class MainOeuvreCedeeWeek extends Model {}

MainOeuvreCedeeWeek.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_main_oeuvre_cd_week',
  timestamps: false
})

export default MainOeuvreCedeeWeek
