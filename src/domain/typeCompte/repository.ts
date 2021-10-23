/* eslint-disable @typescript-eslint/camelcase */
import TypeCompte from './models/typeCompte'

class Repository {
  static async findAll(): Promise<any> {
    return await TypeCompte.findAll()
  }
}

export default Repository
