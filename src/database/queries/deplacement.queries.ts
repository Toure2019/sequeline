/**
 * ... DEPLACEMENT queries ...
 */

import { Deplacement } from '../../models/deplacement/deplacement.model'
// import { DATEFORMATL, getDateFromShortDateAndTime } from '../../util/util'


/** Insérer un departement */
export const insertDeplacementQuery = (deplacement: Deplacement): string => {
    const { userId, villeDepart, codePostal, alleeDepart, alleeArrivee } = deplacement

    return `INSERT INTO t_deplacement (
      t_user_id,
      trajet_aller_date_start,
      trajet_aller_date_end,
      trajet_aller_lieu,
      trajet_aller_departement
    ) VALUES (
      '${userId}',
      '${alleeDepart}',
      '${alleeArrivee}',
      '${villeDepart}',
      '${codePostal}'
    ) RETURNING id;`
}

/** Insertion des modes de transport */
export const insertModeTransport = (deplacementId: number, modeTransportId: number): string => {
  return `INSERT INTO t_mode_transport_trajet (
    t_deplacement_id,
    t_mode_transport_id
    ) VALUES (
      '${deplacementId}',
      '${modeTransportId}'
    );`
}

export const getDeplacementsQuery = (): string => {
  return `SELECT
    id,
    t_user_id,
    travel_sans_retour_imediat,
    trajet_aller_date_start,
    trajet_aller_date_end,
    trajet_aller_lieu,
    trajet_aller_departement,
    trajet_retour_date_start,
    trajet_retour_date_end,
    trajet_retour_lieu,
    trajet_retour_departement,
    motif_lieu,
    motif_departement,
    motif,
    precision,
    vehicule_perso_km,
    vehicule_perso_type,
    repas_utilisation_install_sncf,
    repas_nbre,
    repas_nbre_nuits,
    commentaire,
  FROM t_deplacement;`
}

export const getDeplacementByIdQuery = (id: number): string => {
  return `SELECT
    id,
    t_user_id,
    travel_sans_retour_imediat,
    trajet_aller_date_start,
    trajet_aller_date_end,
    trajet_aller_lieu,
    trajet_aller_departement,
    trajet_retour_date_start,
    trajet_retour_date_end,
    trajet_retour_lieu,
    trajet_retour_departement,
    motif_lieu,
    motif_departement,
    motif,
    precision,
    vehicule_perso_km,
    vehicule_perso_type,
    repas_utilisation_install_sncf,
    repas_nbre,
    repas_nbre_nuits,
    commentaire,
  FROM t_deplacement
  WHERE id='${id}';`
}

export const getDeplacementByUserIdQuery = (userId: number): string => {
  return `SELECT
    id,
    t_user_id,
    travel_sans_retour_imediat,
    trajet_aller_date_start,
    trajet_aller_date_end,
    trajet_aller_lieu,
    trajet_aller_departement,
    trajet_retour_date_start,
    trajet_retour_date_end,
    trajet_retour_lieu,
    trajet_retour_departement,
    motif_lieu,
    motif_departement,
    motif,
    precision,
    vehicule_perso_km,
    vehicule_perso_type,
    repas_utilisation_install_sncf,
    repas_nbre,
    repas_nbre_nuits,
    commentaire,
  FROM t_deplacement
  WHERE t_user_id='${userId}';`
}
