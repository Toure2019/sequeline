/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  num_semaine: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  need_help_take_repos : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  need_entretien : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  message_superieur_send : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_surcroit_trav_excep : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  pref_be_payed : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  week_checked : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  week_checked_responsable : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  is_validated : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  update_t_user_id : {
    type: DataTypes.STRING,
    allowNull: true
  },
  update_t_role_id : {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
}

class EvsWeek extends Model {}
EvsWeek.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_evs_week',
  timestamps: false
})

export default EvsWeek
