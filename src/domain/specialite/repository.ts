/* eslint-disable @typescript-eslint/camelcase */
import Specialite from './models/specialite'

class Repository {
  static async findAll(): Promise<any> {
    return await Specialite.findAll()
  }
}

export default Repository
