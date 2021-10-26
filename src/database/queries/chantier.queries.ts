/**
 * ... CHANTIER queries ...
 */

/** Retourne la liste des comptes actifs pour un établissement donné filtrée par spécialité / type de chantier / mot-clé */
export const getComptesQuery = (currentDate: string, codeEtablissement: string, specialite: string, typeCompte: string, keyword: string) => {
    return `SELECT id, CONCAT(CONCAT(nom, ' '), designation) as libelle from t_compte
    WHERE date_effet <= '${currentDate}'
    AND date_effet_end > '${currentDate}'
    AND t_etablissement_code= '${codeEtablissement}'
    ${typeCompte ? `AND t_type_compte_id = '${typeCompte}'` : '' }
    ${specialite ? `AND t_specialite_id = '${specialite}'` : '' }
    ${keyword ? `AND lower(nom) LIKE '%${keyword.toLowerCase()}%' OR lower(designation) LIKE '%${keyword.toLowerCase()}%'` : '' };`
}
/**
 * EXEMPLE
 * SELECT id, CONCAT(CONCAT(nom, ' '), designation) as libelle from t_compte
    WHERE date_effet <= '2021-10-04T15:01:49.680Z'
    AND date_effet_end > '2021-10-04T15:01:49.680Z'
    AND t_etablissement_code= '251207';
 */


/** Retourne la liste des chantiers en fct de la date donnée (year/weekNumber) */
export const getChantiersQuery = (equipeId: string, year: number, weekNumber: number) => {
    return `SELECT t_inter_chantier.commentaire, t_inter_chantier.id, t_compte_id, t_segment_gestion_id, axe_local, t_cpr_id, clos, t_compte.designation as libellecompte, t_equipe.num_equipe as equipe
    from t_inter_chantier, t_compte, t_equipe
    WHERE t_inter_chantier.t_compte_id = t_compte.id
    AND t_inter_chantier.t_equipe_id = t_equipe.id
    AND t_equipe.id = '${equipeId}'
    AND num_semaine = '${weekNumber}'
    AND annee = '${year}';`
}
/**
 * EXEMPLE
 * SELECT t_inter_chantier.id, t_compte_id, t_segment_gestion_id, axe_local, t_cpr_id, clos, t_compte.designation as libellecompte, t_equipe.num_equipe as equipe
    from t_inter_chantier, t_compte, t_equipe
    WHERE t_inter_chantier.t_compte_id = t_compte.id
    AND t_inter_chantier.t_equipe_id = t_equipe.id
    AND t_equipe.id = '3415'
    AND num_semaine = '40'
    AND annee = '2021';
 */


/** Vérifier l'existence d'un compte */
export const checkExistingChantiersQuery = (year: number, weekNumber: number, compteId: number, condition: string, sousEquipe: string) => {
    return `
    SELECT id FROM t_inter_chantier
    WHERE t_equipe_id='${sousEquipe}'
    AND num_semaine = '${weekNumber}'
    AND annee = '${year}'
    AND t_compte_id='${compteId}'
    AND t_cpr_id='${condition}'
    AND client_link=''
    AND t_engin_id='-1'
    AND axe_local=''
    AND t_segment_gestion_id='525337';`
}
/**
 * EXEMPLE
 * SELECT id FROM t_inter_chantier
    WHERE t_equipe_id='3330'
    AND num_semaine = '40'
    AND annee = '2021'
    AND t_compte_id='765321'
    AND t_cpr_id='1'
    AND client_link=''
    AND t_engin_id='-1'
    AND axe_local=''
    AND t_segment_gestion_id='525337';
 */


/** Récupérer un compte */
export const getCompteQuery = (currentDate: string, compteId: number) => {
    return `
    SELECT id, pc, activite, projet FROM t_compte
    WHERE id='${compteId}'
    AND date_effet <= '${currentDate}'
    AND date_effet_end > '${currentDate}'`
}
/**
 * EXEMPLE
 * SELECT id, pc, activite, projet from t_compte
    WHERE id='765321'
    AND date_effet <= '2021-10-04T15:04:19.122Z'
    AND date_effet_end > '2021-10-04T15:04:19.122Z';
 */


/** Récupérer un compte ERP */
export const getCompteERPQuery = (currentDate: string, compte: any) => {
    return `
    SELECT id FROM t_compte_erp
    WHERE date_effet <= '${currentDate}'
    AND date_effet_end > '${currentDate}'
    AND bupc='${compte.pc}'
    AND activite='${compte.activite}'
    AND projet='${compte.projet}'`
}
/**
 * EXEMPLE
 * SELECT id FROM t_compte_erp
    WHERE date_effet <= '2021-10-04T15:04:19.122Z'
    AND date_effet_end > '2021-10-04T15:04:19.122Z'
    AND bupc='PC503'
    AND activite='Z'
    AND projet='A3FJ00297';
 */


/** Insérer un chantier */
export const insertChantierQuery = (compteId: number, compteERP: any, weekNumber: number, year: number, userId: string, sousEquipe: string, segementDeGestion: string, condition: string) => {
    return `
    INSERT INTO t_inter_chantier (t_compte_id, t_compte_erp_id, num_semaine, annee, t_user_id, t_equipe_id, t_segment_gestion_id, t_cpr_id)
    VALUES ('${compteId}','${compteERP?.id}','${weekNumber}','${year}','${userId}','${sousEquipe}','${segementDeGestion}', '${condition}') RETURNING id;`
}
/**
 * EXEMPLE
 * INSERT INTO t_inter_chantier (t_compte_id, t_compte_erp_id, num_semaine, annee, t_user_id, t_equipe_id, t_segment_gestion_id, t_cpr_id)
    VALUES ('765321','1926966','40','2021','110318','3330','525337', '1') RETURNING id;
 */


/** Retourne le planning associé à un chantier donné */
export const getUserChantierInSpecificDate = (chantierId: string, employeeId: string, day: string) => {
    return `
        SELECT t_user_inter_chantier.duration as duration
        FROM t_user_inter_chantier, t_inter_chantier, t_user
        WHERE t_user.id = t_user_inter_chantier.t_user_planning_t_user_id
        AND t_user_inter_chantier.t_inter_chantier_id = t_inter_chantier.id
        AND t_inter_chantier.id='${chantierId}'
        AND t_user.id='${employeeId}'
        AND t_user_inter_chantier.t_user_planning_date ='${day}'
        LIMIT 7;
    `
}

/** Retourne l'équipe travaillant sur un chantier donné */
export const getChantierSousEquipeQuery = (chantierId: string) => {
    return `
        SELECT t_equipe_id as equipe
        FROM t_inter_chantier
        WHERE t_inter_chantier.id='${chantierId}'
    `
}

/** Retourne les agents travaillant sur un chantier donné */
export const getUserPlanningInOneDayQuery = (employeeId: string, day: string) => {
    return `
        SELECT code_hour, id_t_compte
        FROM t_code_hours_absence, planning
        WHERE planning.id_t_user='${employeeId}'
        AND t_code_hours_absence.id = planning.id_t_code_hours_prevision
        AND planning.date='${day}'
    `
}


/** Retourne pour un chantier donné tous les agents de la sous-équipe associée */
export const getChantierEmployeesQuery = (chantierId: string, currentDate: string )=> {
    return `
        SELECT t_user.id, t_user.nom_complet
        FROM t_inter_chantier, t_user, t_user_properties
        WHERE t_inter_chantier.id='${chantierId}'
        AND t_inter_chantier.t_equipe_id = t_user_properties.t_equipe_id
        AND t_user_properties.t_user_id = t_user.id
        AND t_user_properties.date_effet <= '${currentDate}'
<<<<<<< HEAD
        AND t_user_properties.date_effet_end > '${currentDate}'
=======
        AND t_user_properties.date_effet_end > '${currentDate}'
>>>>>>> develop
    `
}

/** Rattacher un chantier donné à tous les agents de la sous-équipe */
export const addEmployeesToChantierQuery = (chantierId: string, userId: string, currentDate: string) => {
    return `
        INSERT INTO t_user_inter_chantier VALUES (${chantierId}, '${currentDate}', ${userId}, '00:00:00', 0)
    `
}

/** Récupérer un chantier par id */
export const getChantierByIdQuery = (chantierId: string) => {
    return `
    SELECT id, commentaire
    FROM t_inter_chantier
    WHERE id='${chantierId}'
    `
}

/** Mise à jour du commentaire d'un chantier donné */
export const updateChantierCommentaireQuery = (chantierId: string, commentaire: string) => {
    return `
    UPDATE t_inter_chantier
    SET commentaire='${commentaire}'
    WHERE id='${chantierId}'
    `
}


/** Mise à jour du temps passé sur un chantir donné */
export const updateAgentImputationChantierQuery = (chantierId: string, date: string, employeeId: string, duration: string) => {
    return `
    UPDATE t_user_inter_chantier
    SET duration='${duration ? duration : '00:00'}'
    WHERE t_inter_chantier_id='${chantierId}'
    AND t_user_planning_date='${date}'
    AND t_user_planning_t_user_id='${employeeId}'`
}

/** Récupérer un code JS */
export const getCodeJSQuery = (codeJS: string, currentEtablissement: string) => {
    return `
    SELECT id, duree_journee, duree_pauses, duree_coupures
    FROM code_hours
    WHERE code_hour='${codeJS}' AND code_t_etablissement='${currentEtablissement}'`
}

/** Récupérer un code absence */
export const findCodeAbsenceQuery = (codeJS: string, currentEtablissement: string) => {
    return  `SELECT code_hour
    FROM t_code_hours_absence
    WHERE id_t_compte IS NOT NULL
    AND code_hour='${codeJS}'
    ${currentEtablissement ? `AND code_t_etablissement = '${currentEtablissement}'` : '' };`
}

/** Récupérer le total passé sur les chantiers pour un agent sur une journée */
export const getTotalWorkTimeInOneDayQuery = (employeeId: string, date: string) => {
    return  `SELECT duration
    FROM t_user_inter_chantier
    WHERE t_user_planning_t_user_id ='${employeeId}'
    AND t_user_planning_date='${date}';`
}
