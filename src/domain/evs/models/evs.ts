/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: true,
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  date_update: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  update_t_user_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  update_t_role_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  check_evs : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  clos : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  date_cloture : {
    type: DataTypes.DATE,
    allowNull: true
  },
  cloture_t_user_id : {
    type: DataTypes.STRING,
    allowNull: true
  },
  transport_aller_start: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transport_aller_end: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transport_retour_start: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transport_retour_end: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  plaque_vehicule : {
    type: DataTypes.STRING,
    allowNull: true
  },
  vehicule_trajet : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  ecart_start : {
    type: DataTypes.STRING,
    allowNull: true
  },
  ecart_end : {
    type: DataTypes.STRING,
    allowNull: true
  },
  ecart_prolongation_acc : {
    type: DataTypes.STRING,
    allowNull: true
  },
  ecart_relevage : {
    type: DataTypes.STRING,
    allowNull: true
  },
  ecart_duree_trajet_hs : {
    type: DataTypes.STRING,
    allowNull: true
  },
  indemn_conduite_tx : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_sortie_tx : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_de_saisie_bak_1 : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_de_saisie : {
    type: DataTypes.STRING,
    allowNull: true
  },
  indemn_heberg_non_propo : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_heberg_non_retenu : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_train_parc : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_chambre_hc : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_chambre_hi : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_deplacements : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_deplacements_vm00_km : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_panier : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_travail_salissant : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_travail_penible : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_travail_tunnel : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_decouche_force : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_repas_force : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  astreinte_tx : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  astreinte_rs : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  prime_agent_ttx : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  commentaire : {
    type: DataTypes.STRING,
    allowNull: true
  },
  special_nuit : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  continuite_service_rempl_ic : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  travaux_nuit_is : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  special_travaux_nuit_is : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_grue_gr : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_journ_manoeuvre_mv : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_supp_manoeuvre_mh : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  indemn_tracteur_tr : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  conduite_engin_ferrov_tq : {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
}

class Evs extends Model {}
Evs.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_evs',
  timestamps: false
})

export default Evs
