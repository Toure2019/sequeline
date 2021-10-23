/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    primaryKey: true
  },
  date_affectation: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  date_effet_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_cessation_activite: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  flag_type_validation: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  code_poste: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_uo_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_uo_code_assistant: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_emploi_repere_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_dimension_manageriale_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_departement_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_user_login_manager: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_equipe_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  t_code_ressource_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  search: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  t_uo_code_compare: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_emploi_repere_code_compare: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_dimension_manageriale_code_compare: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_departement_code_compare: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class UserProperties extends Model {}

UserProperties.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_properties',
  timestamps: false
})

export default UserProperties
