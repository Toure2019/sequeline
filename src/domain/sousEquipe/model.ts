/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  num_equipe: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  t_uo_code: {
    type: DataTypes.STRING(45)
  },
  nom: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  t_user_id_create: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  spot_equipe: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  search: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  t_departement_code: {
    type: DataTypes.STRING(45)
  },
  date_end: {
    type: DataTypes.DATE,
    allowNull: true
  }
}

class SousEquipe extends Model {}

SousEquipe.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_equipe',
  timestamps: false
})

export default SousEquipe
