export interface DeplacementModel {
  id: number;
  t_user_id: number;
  num_mois?: number;
  annee?: number;
  date_validate_user?: Date;
  date_validate_gu?: Date;
  t_user_id_gu?: number;
  repas_force?: number;
  decouche_force?: number;
  repas_force_final?: number;
  decouche_force_final?: number;
  version?: Date;
  date_validate_manager?: Date;
  t_user_id_manager?: number;
  date_validate_responsable?: Date;
  t_user_id_responsable?: number;
}
