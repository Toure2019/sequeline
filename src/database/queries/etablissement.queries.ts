/**
 * ... ETABLISSEMENT queries ...
 */

/** Retourne toutes les UOs en fct de l'établissement et la date donnée */
export const allEtablissementsQuery = (codeEtablissement?: string) => {
    return `SELECT code as id, libelle_min as libelle 
    FROM t_etablissement
    WHERE enabled=1
    AND date_effet <= NOW()
    AND date_effet_end > NOW()
    ${codeEtablissement ? `AND code = '${codeEtablissement}'` : '' };`
}
