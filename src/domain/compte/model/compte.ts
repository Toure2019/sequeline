/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  t_type_compte_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  t_specialite_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  date_effet_end: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  nom: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  activite: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  projet: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  pc: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  code_uop: {
    type: DataTypes.STRING,
    allowNull: true
  },
  need_rapport: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  localisable: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  mobilite: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  filtre: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  t_profil_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '1'
  },
  visible: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '1'
  },
  sous_categorie: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  no_productif: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  qte_uo_max_day: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  qte_uo_max_week: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cpt_intermediaire: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  cpt_intermediaire_is_set: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  from_erp: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: '0'
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  t_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class Compte extends Model {}
Compte.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_compte',
  timestamps: false
})

export default Compte
