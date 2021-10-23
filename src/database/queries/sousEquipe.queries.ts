/**
 * ... SOUS-EQUIPES queries ...
 */

 /** Retourne toutes les sous-équipes */
 export const allSousEquipesQuery = (uos: string, sousEquipeId?: string) => {
    return `
    select DISTINCT id, num_equipe as libelle, t_uo.code as code_uo, t_uo.libelle_min as libelle_uo
    FROM t_equipe, t_uo
    WHERE t_equipe.t_uo_code = t_uo.code 
    AND date_end > NOW()
    ${sousEquipeId ? `AND id = '${sousEquipeId}'` : '' }
    ${uos && !sousEquipeId ? `AND t_uo_code IN (${uos})` : '' };`
}

/** Retourne toutes les sous-équipes d'un établissement donné (s'il est renseigné) */
export const getSousEquipesListQuery = (currentDate: string, codeEtablissement: string) => {
    return `SELECT DISTINCT t_equipe.id, t_equipe.num_equipe, t_equipe.nom, t_departement.code as departement_code, t_departement.libelle_min as departement_libelle_min, t_uo.code as uo_code, t_uo.libelle_min as uo_libelle_min, t_equipe.date_end
    FROM t_equipe, t_uo, t_departement
    WHERE t_equipe.t_uo_code = t_uo.code
    AND t_equipe.t_departement_code = t_departement.code
    AND t_equipe.date_end > '${currentDate}'
    ${codeEtablissement ? `AND t_uo.t_etablissement_code = '${codeEtablissement}'` : '' };`
}
/**
 * EXEMPLE
 * SELECT t_equipe.id, t_equipe.num_equipe, t_equipe.nom, t_departement.code as departement_code, t_departement.libelle_min as departement_libelle_min, t_uo.code as uo_code, t_uo.libelle_min as uo_libelle_min, t_equipe.date_end
    FROM t_equipe, t_uo, t_departement
    WHERE t_equipe.t_uo_code = t_uo.code
    AND t_equipe.t_departement_code = t_departement.code
    AND t_equipe.date_end > '2021-10-04T14:44:31.036Z'
    AND t_uo.t_etablissement_code = '251207';
 */

export const selectEquipeEmployeesQuery = (sousEquipeId: string, currentDate: string) => {
    return `select id, nom_complet 
            FROM t_user, t_user_properties where
            t_user_properties.t_user_id = t_user.id
            AND t_user_properties.t_equipe_id = ${sousEquipeId}
            AND t_user_properties.date_effet < '${currentDate}'
            AND t_user_properties.date_effet_end > '${currentDate}'`
}