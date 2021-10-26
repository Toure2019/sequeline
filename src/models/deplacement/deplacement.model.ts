export interface Deplacement {
  id?: number;
  userId: number;
  villeDepart: string,
  codePostal: string,
  alleeDepart: Date | null,
  alleeArrivee: Date | null,
  modeTransport: number[],
  trajet_retour_date_start?: Date;
  trajet_retour_date_end?: Date;
  trajet_retour_lieu?: string;
  trajet_retour_departement?: string;
  motif_lieu?: string;
  motif_departement?: string;
  motif?: number;
  precision?: string;
  vehicule_perso_km?: string;
  vehicule_perso_type?: number;
  repas_utilisation_install_sncf?: number;
  repas_nbre?: number;
  repas_nbre_nuits?: number;
  commentaire?: string;
}
