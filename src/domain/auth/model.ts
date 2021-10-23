/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  login: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  nom: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  nom_complet: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  is_superuser: {
    type: DataTypes.SMALLINT,
    defaultValue: 0
  },
  mail: {
    type: DataTypes.STRING(200)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  password: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(45)
  },
  date_end_token: {
    type: DataTypes.DATEONLY
  },
  date_create: {
    type: DataTypes.DATEONLY
  },
  enabled: {
    type: DataTypes.SMALLINT,
    defaultValue: 1
  },
  search: {
    type: DataTypes.TEXT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  flag_type_validation: {
    type: DataTypes.SMALLINT,
    defaultValue: 0
  },
  t_uo_code_assistant: {
    type: DataTypes.STRING(45)
  }
}

class User extends Model {}
User.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user',
  timestamps: false
})

export default User
