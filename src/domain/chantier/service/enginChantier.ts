import Repository from '../repository/EnginChantier'
import enginSchema from '../schema/enginChantier'
import { get422Error } from '../../../util/util'
import DB from '../../../database/connection'
import moment from 'moment-timezone'

class Service {
  static async validateRequest(data: any) {
    const response = enginSchema.validate(data)
    const result = response.value
    let error = null

    if (response.error) {
      error = get422Error(response)
    }

    return { result, error }
  }

  static async findOneById(id: string) {
    return Repository.findOneById(id)
  }

  static async addListRessources(chantierId: number, ressourceChantiers: any) {
    const currentDate = moment()
      .tz('Europe/Paris')
      .format('YYYY-MM-DD')

    const transaction = await DB.transaction()
    try {
      await Repository.deleteRessourceChantier(chantierId)
      for (const ressourceChantier of ressourceChantiers) {
        await Repository.addRessourceChantier(
          { ...ressourceChantier, version: currentDate },
          transaction
        )
      }
      transaction.commit()
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static async removeListRessources(chantierId: number) {
    const transaction = await DB.transaction()
    try {
      await Repository.deleteRessourceChantier(chantierId)
      transaction.commit()
    } catch (err) {
      console.error(err)
      await transaction.rollback()
      throw err
    }
  }

  static async findAllByChantier(chantierId: number) {
    return await Repository.findAllByChantier(chantierId)
  }
}

export default Service
