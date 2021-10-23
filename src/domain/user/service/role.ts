import Repository from './../repository'

class Service {
  static async findAllRoles() {
    return await Repository.findAllRoles()
  }

  static async findAllUserRolesAccessibles(userId: number) {
    return await Repository.findAllUserRolesAccessibles(userId)
  }
}

export default Service
