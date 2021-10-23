/* eslint-disable @typescript-eslint/camelcase */
import DB from '../../../database/connection'
import { QueryTypes } from 'sequelize'
import { DATEFORMAT, now } from '../../../util/util'

class Repository {
  static getAllUsersAndEquipes = async (codeEtablissement: number) => {
    const currentDate = now(DATEFORMAT)

    const request = `select login, t_user.nom as nom_agent, t_user.prenom, t_equipe.num_equipe, t_equipe.nom 
    from t_user 
    inner join t_user_properties on t_user.id = t_user_id 
    inner join t_uo on t_user_properties.t_uo_code = t_uo.code
    inner join t_etablissement ON t_etablissement.code = t_uo.t_etablissement_code
    inner join t_type_uo on t_uo.t_type_uo_code = t_type_uo.code
    left join t_equipe on t_user_properties.t_equipe_id = t_equipe.id
    where t_etablissement_code = '${codeEtablissement}'
    and t_user.enabled = '1' 
    and t_user_properties.date_effet <= '${currentDate}' and t_user_properties.date_effet_end > '${currentDate}'
    and t_uo.date_effet <= '${currentDate}' and t_uo.date_effet_end > '${currentDate}'
    and t_etablissement.date_effet <= '${currentDate}' and t_etablissement.date_effet_end > '${currentDate}'`

    return DB.query(request, { type: QueryTypes.SELECT, raw: true })
  }
}

export default Repository
