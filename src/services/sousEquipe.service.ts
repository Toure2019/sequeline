import { QueryTypes } from 'sequelize'
import { allSousEquipesQuery, getSousEquipesListQuery } from '../database/queries/sousEquipe.queries'
import sequelize from '../database/connection'
import UserService from './user.service'

class Service {
    static async getAllSousEquipes(uos: any[] = [], sousEquipeId?: string) {
        try {
            const uoIds = uos?.map((uo)=> `'${uo.id}'`).join()
            return await sequelize.query(allSousEquipesQuery(uoIds, sousEquipeId), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }
    
    static async getSousEquipesList(currentDate: string, codeEtablissement: string) {
        try {
            return await sequelize.query(getSousEquipesListQuery(currentDate, codeEtablissement), { type: QueryTypes.SELECT, nest: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getNumberOfUsers(sousEquipeId: string, codeEtablissement: string, currentDate: string,) {
        try {
           const users = await UserService.getUsersBySousEquipe(sousEquipeId, codeEtablissement, currentDate)
           return users.length

          } catch(e) {
            throw new Error(e.message)
        }
    }

}
export default Service
