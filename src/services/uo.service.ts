import { QueryTypes } from 'sequelize'
import { getAllUOsWithChildrenQuery, uoListQuery } from '../database/queries/uo.queries'
import sequelize from '../database/connection'
import { allUOsQuery } from '../database/queries/user.queries'

class Service {
    static async getUOsList(currentDate: string, codeEtablissement: string) {
        try {
            return await sequelize.query(uoListQuery(codeEtablissement, currentDate), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getAllUOs(codeEtablissement?: string, codeUO?: string) {
        try {
            return await sequelize.query(allUOsQuery(codeEtablissement, codeUO), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getAllUOsWithChildren(codeUO: string) {
        try {
            return await sequelize.query(getAllUOsWithChildrenQuery(codeUO), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

}
export default Service
