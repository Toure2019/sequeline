/**
 * ... UO queries ...
 */

/** Retourne toutes les UOs et leurs UOs filles */
export const getAllUOsWithChildrenQuery = (codeUO: string) => {
    return `SELECT code as id, libelle_min as libelle 
    FROM t_uo
    WHERE code='${codeUO}' OR t_uo_code_parent='${codeUO}'`
}


/** Retourne toutes les UOs en fct de l'établissement et la date donnée */
export const uoListQuery = (codeEtablissement: string, currentDate: string) => {
    return `
    select DISTINCT t_uo.code as uo_code, t_uo.libelle_min as uo_libelle_min, t_uo.libelle as uo_libelle, t_type_uo.t_niveau_uo_code as niveau, t_uo_parent.code as uo_parent_code, t_uo_parent.libelle_min as uo_parent_libelle_min, t_departement.code as departement_code, t_departement.libelle_min as departement_libelle_min, (select count(*) as count_sous_equipes from t_equipe as equipes where equipes.t_uo_code = t_uo.code)
    FROM t_uo, t_uo as t_uo_parent, t_type_uo, t_departement, t_etablissement
    WHERE t_uo.t_type_uo_code = t_type_uo.code
    AND t_uo.t_uo_code_parent = t_uo_parent.code 
    AND t_uo.t_departement_code = t_departement.code
    AND t_uo.date_effet <= '${currentDate}'
    AND t_uo.date_effet_end > '${currentDate}'
    AND t_uo.enabled = 1
    AND t_departement.enabled = 1
    AND t_uo.t_etablissement_code = t_etablissement.code
    AND t_etablissement.enabled = 1
    AND t_etablissement.date_effet <= '${currentDate}'
    AND t_etablissement.date_effet_end > '${currentDate}'
    AND t_etablissement.code = '${codeEtablissement}';`
}
/**
 * EXEMPLE
 *  select DISTINCT t_uo.code as uo_code, t_uo.libelle_min as uo_libelle_min, t_uo.libelle as uo_libelle, t_type_uo.t_niveau_uo_code as niveau, t_uo_parent.code as uo_parent_code, t_uo_parent.libelle_min as uo_parent_libelle_min, t_departement.code as departement_code, t_departement.libelle_min as departement_libelle_min, (select count(*) as count_sous_equipes from t_equipe as equipes where equipes.t_uo_code = t_uo.code)
    FROM t_uo, t_uo as t_uo_parent, t_type_uo, t_departement
    WHERE t_uo.t_type_uo_code = t_type_uo.code
    AND t_uo.t_uo_code_parent = t_uo_parent.code 
    AND t_uo.t_departement_code = t_departement.code
    AND t_uo.date_effet <= '2021-10-04T15:01:49.680Z'
    AND t_uo.date_effet_end > '2021-10-04T15:01:49.680Z'
    AND t_uo.enabled = 1
    AND t_departement.enabled = 1
    AND t_etablissement_code= '251207';
 */