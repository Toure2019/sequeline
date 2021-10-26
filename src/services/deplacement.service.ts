import { QueryTypes } from 'sequelize'
import sequelize from '../database/connection'
import { insertDeplacementQuery } from '../database/queries/deplacement.queries'
import { Deplacement } from '../models/deplacement/deplacement.model'

class Service {
  static async insertDeplacement(deplacement: Deplacement) {
    let error = null
    const insertedDeplacement = await sequelize.query(
      insertDeplacementQuery(deplacement),
      { type: QueryTypes.INSERT, nest: true, plain: true }
    )
    if(!insertedDeplacement){
      error = {
        message: 'Une erreur est survenue lors d el\'insertion du chantier',
        status: 500
      }
    }
    // TODO : Insérer les mode de transport du déplacement en cours...
    return { deplacement: insertedDeplacement, error: error }
  }
}

export default Service
