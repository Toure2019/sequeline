/**
 * ... USER queries ...
 */

 /** Retourne toutes les UOs */
export const allUOsQuery = (codeEtablissement?: string, codeUO?: string) => {
    return `
    select t_uo.code as id, t_uo.libelle_min as libelle, t_etablissement_code as etablissement, t_departement.code as code_departement, t_departement.libelle_min as libelle_departement
    FROM t_uo, t_departement
    WHERE t_uo.t_departement_code = t_departement.code
    AND t_uo.enabled=1
    AND t_uo.date_effet <= NOW()
    AND t_uo.date_effet_end > NOW()
    ${codeUO ? `AND t_uo.code = '${codeUO}'` : '' }
    ${codeEtablissement ? `AND t_uo.t_etablissement_code = '${codeEtablissement}'` : '' };`
}

/** Retourne la liste des utilisateurs 1/actifs (si active égal à 1) 2/en fct de l'établissement sélectionné (s'il est renseigné) */
export const getUsersListQuery = (currentDate: string, codeEtablissement: string, active: number, sousEquipeId?: number) => {
    return `SELECT id, login as cp, t_user.enabled, nom, prenom
    FROM t_user, t_user_properties, t_uo, t_etablissement
    WHERE t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '${currentDate}'
    AND t_user_properties.date_effet_end > '${currentDate}'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_etablissement_code = t_etablissement.code
    ${active == 1 ? 'AND t_user.enabled = 1' : '' }
    ${sousEquipeId ? `AND t_user_properties.t_equipe_id = '${sousEquipeId}'` : '' }
    ${codeEtablissement ? `AND t_etablissement.code = '${codeEtablissement}'` : '' };`
}
/**
 * EXEMPLE
 * SELECT id, login as cp, t_user.enabled, nom, prenom
    FROM t_user, t_user_properties, t_uo, t_etablissement
    WHERE t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '2021-10-04T14:44:31.036Z'
    AND t_user_properties.date_effet_end > '2021-10-04T14:44:31.036Z'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_etablissement_code = t_etablissement.code
    AND t_user.enabled = 1
    AND t_etablissement.code = '251207';
 */


/** Retourne la liste des profils d'un utilisaeur donné */
export const getUserProfilsQuery = (userId: number) => {
    return `SELECT t_profiles.id, t_profiles.index, t_profiles.name as libelle, t_profiles.scope, t_user_profiles.scope_id
    FROM t_user, t_user_profiles, t_profiles
    WHERE t_user.id = '${userId}'
    AND t_user_profiles.t_user_id = t_user.id
    AND t_user_profiles.t_profiles_id  = t_profiles.id
    AND t_profiles.enabled = 1
    order by t_profiles.name`
}
/**
 * EXEMPLE
 * SELECT t_user.id, t_role.id, t_role.libelle as name
    FROM t_user, t_user_roles, t_role
    WHERE t_user.id = '119815'
    AND t_user_roles.t_user_id = t_user.id
    AND t_user_roles.t_role_id = t_role.id;
 */

/** Retourne la sous-équipe d'un utilisaeur donné */
export const getUserSousEquipeQuery = (userId: number, currentDate?: string) => {
    return `SELECT t_equipe.id, t_equipe.num_equipe as libelle
    FROM t_user, t_user_properties, t_equipe
    WHERE t_user.id = t_user_properties.t_user_id
    AND t_user_properties.t_equipe_id = t_equipe.id
    AND t_user.id='${userId}'
    ${currentDate ? `AND t_user_properties.date_effet <= '${currentDate}'` : 'AND t_user_properties.date_effet <= NOW()' }
    ${currentDate ? `AND t_user_properties.date_effet_end > '${currentDate}'` : 'AND t_user_properties.date_effet_end > NOW()' };`
}

/**
 * EXEMPLE
 * SELECT t_equipe.id, t_equipe.num_equipe
    FROM t_user, t_user_properties, t_equipe
    WHERE
    t_user.id='119815'
    AND t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '2021-10-04T14:44:31.036Z'
    AND t_user_properties.date_effet_end > '2021-10-04T14:44:31.036Z'
    AND t_user_properties.t_equipe_id = t_equipe.id;
 */

/** Retourne l'UO d'un utilisaeur donné */
export const getUserUOQuery = (userId: number, currentDate: string) => {
    return `SELECT t_uo.code, t_uo.libelle, t_type_uo.t_niveau_uo_code as niveau
    FROM t_user, t_user_properties, t_uo, t_type_uo
    WHERE
    t_user.id='${userId}'
    AND t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '${currentDate}'
    AND t_user_properties.date_effet_end > '${currentDate}'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_type_uo_code = t_type_uo.code;`
}
/**
 * EXEMPLE
 * SELECT t_uo.code, t_uo.libelle, t_type_uo.t_niveau_uo_code as niveau
    FROM t_user, t_user_properties, t_uo, t_type_uo
    WHERE
    t_user.id='119815'
    AND t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '2021-10-04T14:44:31.036Z'
    AND t_user_properties.date_effet_end > '2021-10-04T14:44:31.036Z'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_type_uo_code = t_type_uo.code;
 */

/** Retourne l'etablissement d'un utilisaeur donné */
export const getUserEtablissementQuery = (userId: number, currentDate: string) => {
    return `SELECT t_etablissement.code as code, t_etablissement.libelle_min as libelle, t_uo.code as codeUO, t_uo.libelle_min as libelleUO
    FROM t_user, t_user_properties, t_uo, t_etablissement
    WHERE
    t_user.id='${userId}'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_etablissement_code = t_etablissement.code
    AND t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '${currentDate}'
    AND t_user_properties.date_effet_end > '${currentDate}'
    AND t_uo.date_effet <= '${currentDate}'
    AND t_uo.date_effet_end > '${currentDate}'
    AND t_etablissement.date_effet <= '${currentDate}'
    AND t_etablissement.date_effet_end > '${currentDate}';`
}


/** Retourne le code ressource d'un utilisaeur donné */
export const getUserCodeRessourceQuery = (userId: number, currentDate: string) => {
    return `SELECT t_user_properties.t_code_ressource_code
    FROM t_user, t_user_properties
    WHERE
    t_user.id='${userId}'
    AND t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '${currentDate}'
    AND t_user_properties.date_effet_end > '${currentDate}';`
}
/**
 * EXEMPLE
 * SELECT t_user_properties.t_code_ressource_code
    FROM t_user, t_user_properties
    WHERE
    t_user.id='119798'
    AND t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '2021-10-04T14:44:31.036Z'
    AND t_user_properties.date_effet_end > '2021-10-04T14:44:31.036Z';
 */

/** Retourne tous les utlisateurs d'une sous-équipe donné */
export const getUsersBySousEquipeQuery = (sousEquipeId: string, etablissementCode: string, currentDate: string) => {
    return `SELECT t_user.id, t_user.nom_complet from t_user, t_user_properties, t_uo
    WHERE t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '${currentDate}'
    AND t_user_properties.date_effet_end > '${currentDate}'
    AND t_user_properties.t_equipe_id='${sousEquipeId}'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_etablissement_code = '${etablissementCode}';`
}
/**
 * EXEMPLE
 * SELECT t_user.id from t_user, t_user_properties, t_uo
    WHERE t_user.id = t_user_properties.t_user_id
    AND t_user_properties.date_effet <= '2021-10-04T14:44:31.036Z'
    AND t_user_properties.date_effet_end > '2021-10-04T14:44:31.036Z'
    AND t_user_properties.t_equipe_id='6135'
    AND t_user_properties.t_uo_code = t_uo.code
    AND t_uo.t_etablissement_code = '251207';
 */


/** Mise à jour de l'email et téléphone d'un utilisateur donné */
export const updateUserMailAndPhoneQuery = (mail: string, phone: string, userId: string) => {
    return `UPDATE t_user SET
    mail='${mail}',
    phone='${phone}'
    WHERE id='${+userId}';`
}
/**
 * EXEMPLE
 * UPDATE t_user SET
    mail='agnes.bellard@reseau.sncf.fr',
    phone='+33777886180'
    WHERE id='110318';
 */

/** Retourne l'utilisateur à partir de son login */
export const getUserByLoginQuery = (login: string) => {
    return `SELECT id, nom, prenom, login, password, enabled FROM t_user WHERE login='${login}'`
}

/** Retourne l'utilisateur à partir de son login */
export const getUserByIdQuery = (id: string) => {
    return `SELECT id, nom, prenom, login, password, enabled FROM t_user WHERE id='${id}'`
}
