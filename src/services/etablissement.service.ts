import { QueryTypes } from 'sequelize'
import sequelize from '../database/connection'
import { allEtablissementsQuery } from '../database/queries/etablissement.queries'

class Service {
    static async getAllEtablissements(scopeId? : string) {
        try {
            return await sequelize.query(allEtablissementsQuery(scopeId), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }
}
export default Service
