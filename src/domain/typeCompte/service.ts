import Repository from './repository'

class Service {
  static findAll(): Promise<any> {
    return Repository.findAll()
  }
}

export default Service
