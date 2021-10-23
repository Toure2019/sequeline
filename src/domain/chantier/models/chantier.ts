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
  t_compte_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_compte_erp_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  num_semaine: {
    type: DataTypes.STRING,
    allowNull: false
  },
  annee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_equipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_segment_gestion_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_cpr_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  client_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  t_engin_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  clos: {
    type: DataTypes.STRING,
    allowNull: true
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
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

class Chantier extends Model {}
Chantier.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_inter_chantier',
  timestamps: false
})

export default Chantier
