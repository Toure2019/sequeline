import db from '../../src/database/connection'

const resetDB = async () => {
  // return new Promise((resolve, reject) => {
  //   return db.sync({ force: true })
  // }).then(() => resolve())

  return new Promise(resolve => {
    const foreignKeyOff = 'PRAGMA foreign_keys = OFF'
    return db
      .query(foreignKeyOff)
      .then(() => {
        return db.sync({ force: true })
      })
      .then(() => {
        return db.query(foreignKeyOff)
      })
      .then(() => {
        resolve(true)
      })
      .catch((/*err*/) => {
        resolve(true)
        //console.error({ isError: true, status: err.message })
      })
  })
}

export { resetDB }
