import { QueryTypes } from 'sequelize'
import { getUsersListQuery, getUserProfilsQuery, getUserSousEquipeQuery, getUserUOQuery, getUserCodeRessourceQuery, getUsersBySousEquipeQuery, updateUserMailAndPhoneQuery, getUserByLoginQuery, getUserEtablissementQuery, getUserByIdQuery } from '../database/queries/user.queries'
import sequelize from '../database/connection'
import EtablissementService from './etablissement.service'
import UOService from './uo.service'
import SousEquipesService from './sousEquipe.service'
import jwt from 'jsonwebtoken'
import UserService from './user.service'
import secretKey from '../config/secret'

class Service {
    static async getUsersList(currentDate: string, codeEtablissement: string, active: number, sousEquipeId?: number) {

        try {
            const users: any[] = await sequelize.query(getUsersListQuery(currentDate, codeEtablissement, active, sousEquipeId), { type: QueryTypes.SELECT, nest: true })

            const result = []
            for (const user of users) {
                const userEtablissement: any = await Service.getUserEtablissement(user.id, currentDate)
                result.push({
                    ...user,
                    codeRessource : await Service.getUserCodeRessource(user.id, currentDate),
                    uo: await Service.getUserUO(user.id, currentDate),
                    sousEquipe: await Service.getUserSousEquipe(user.id, currentDate),
                    profils: await Service.getUserProfils(user, userEtablissement),
                })
            }

            return result

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserProfils(user: any, userEtablissement: any) {
        try {
            const profils: any[] = await sequelize.query(getUserProfilsQuery(user.id), { type: QueryTypes.SELECT, nest: true })

            return await Promise.all(
                profils.map(async (profil: any) => {

                    let etablissements = []
                    let uos = []
                    let sousEquipes = []

                    switch (profil.scope) {
                        case 'ALL': {
                                etablissements = await EtablissementService.getAllEtablissements()
                                uos = await UOService.getAllUOs()
                                sousEquipes = await SousEquipesService.getAllSousEquipes()
                                break
                        }
                        case 'ETABLISSEMENT': {
                                etablissements = await EtablissementService.getAllEtablissements(profil.scope_id)
                                uos = await UOService.getAllUOs(profil.scope_id)
                                sousEquipes = await SousEquipesService.getAllSousEquipes(uos)
                                break
                        }
                        case 'UO_AND_CHILD': {
                            etablissements = [{id: userEtablissement?.code, libelle: userEtablissement?.libelle}]
                            uos = await UOService.getAllUOsWithChildren(profil.scope_id)
                            sousEquipes = await SousEquipesService.getAllSousEquipes(uos)
                            break
                        }
                        case 'UO_ASSISTANT_AND_CHILD': {
                            etablissements = [{id: userEtablissement?.code, libelle: userEtablissement?.libelle}]
                            uos = await UOService.getAllUOsWithChildren(profil.scope_id)
                            sousEquipes = await SousEquipesService.getAllSousEquipes(uos)
                            break
                        }
                        case 'UO_VP': {
                            etablissements = [{id: userEtablissement?.code, libelle: userEtablissement?.libelle}]
                            uos = await UOService.getAllUOs(userEtablissement?.code, profil.scope_id)
                            sousEquipes = await SousEquipesService.getAllSousEquipes(uos)
                            break
                        }
                          case 'EQUIPE': {
                            etablissements = [{id: userEtablissement.code, libelle: userEtablissement.libelle}]
                            uos = await UOService.getAllUOs(userEtablissement.code, userEtablissement.codeuo)
                            sousEquipes = await SousEquipesService.getAllSousEquipes(uos, profil.scope_id)
                            break
                        }
                        case 'AGENT': {
                            etablissements = [{id: userEtablissement.code, libelle: userEtablissement.libelle}]
                            uos = await UOService.getAllUOs(userEtablissement.code, userEtablissement.codeuo)
                            sousEquipes = [await UserService.getUserSousEquipe(user.id)]
                            break
                        }
                    }

                    return { ...profil, scope: {
                        etablissements,
                        uos,
                        sousEquipes
                    } }
                })
            )
          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserSousEquipe(userId: number, currentDate?: string) {
        try {
            return sequelize.query(getUserSousEquipeQuery(userId, currentDate), { type: QueryTypes.SELECT, nest: true, plain: true })

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserUO(userId: number, currentDate: string) {
        try {
            return sequelize.query(getUserUOQuery(userId, currentDate), { type: QueryTypes.SELECT, nest: true, plain: true })

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserEtablissement(userId: number, currentDate: string) {
        try {
            return sequelize.query(getUserEtablissementQuery(userId, currentDate), { type: QueryTypes.SELECT, nest: true, plain: true })

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserCodeRessource(userId: number, currentDate: string) {
        try {
            const codeRessource: any = await sequelize.query(getUserCodeRessourceQuery(userId, currentDate), { type: QueryTypes.SELECT, nest: true, plain: true })

            return codeRessource.t_code_ressource_code ? codeRessource.t_code_ressource_code : null

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUsersBySousEquipe(sousEquipeId: string, etablissementCode: string, currentDate: string) {
        try {

            return  await sequelize.query(getUsersBySousEquipeQuery(sousEquipeId, etablissementCode, currentDate), { type: QueryTypes.SELECT, nest: true});

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async updateUserMailAndPhone(mail: string, phone: string, userId: string) {
        try {
            return await sequelize.query(updateUserMailAndPhoneQuery(mail, phone, userId), { type: QueryTypes.UPDATE})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserByLogin(login: string) {
        try {
            return await sequelize.query(getUserByLoginQuery(login), { type: QueryTypes.SELECT, plain: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async getUserById(id: string) {
        try {
            return await sequelize.query(getUserByIdQuery(id), { type: QueryTypes.SELECT, plain: true})

          } catch(e) {
            throw new Error(e.message)
        }
    }

    static async generateToken(user: any) {

        return jwt.sign(
          {
            user: user.id,
            role: user.roles.map((role) =>({id: role.id, libelle: role.libelle}))
          },
          secretKey,
          {
            expiresIn: '1d'
          }
        )
      }
}
export default Service
