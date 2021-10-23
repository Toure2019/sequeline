import Repository from '../repository/evsRepository'

class Service {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static findAll(date: string, userID: string): Promise<any> {
    return Repository.findAll(date, userID)
  }

  static findAllEvsForDuplicate(date: string, userID: string, transaction): Promise<any> {
    return Repository.findAllEvsForDuplicate(date, userID, transaction)
  }

  static findAllEvsDataForDuplicate(date: string, userID: string, transaction): Promise<any> {
    return Repository.findAllEvsDataForDuplicate(date, userID, transaction)
  }

  static findAllEvsWeekForDuplicate(date: string, userID: string, transaction): Promise<any> {
    return Repository.findAllEvsWeekForDuplicate(date, userID, transaction)
  }

  static addListEvs(data: any, transaction): Promise<any> {
    return Repository.addListEvs(data, transaction)
  }

  static addListEvsData(data: any, transaction): Promise<any> {
    return Repository.addListEvsData(data, transaction)
  }

  static addListEvsWeek(data: any, transaction): Promise<any> {
    return Repository.addListEvsWeek(data, transaction)
  }

  static removeListEvs(userId: number, date: string, transaction): Promise<any> {
    return Repository.removeListEvs(userId, date, transaction)
  }

  static removeListEvsData(userId: number, date: string, transaction): Promise<any> {
    return Repository.removeListEvsData(userId, date, transaction)
  }

  static removeListEvsWeek(userId: number, date: string, transaction): Promise<any> {
    return Repository.removeListEvsWeek(userId, date, transaction)
  }

  static upsert(evsData: any): Promise<any> {
    return Repository.upsertData(evsData)
  }
   
}

export default Service
