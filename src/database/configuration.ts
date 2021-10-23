import { Options } from 'sequelize'

import dotenv from 'dotenv'

dotenv.config()

const getConfiguration = () => {
  if (process.env.NODE_ENV === 'test') {
    const testConfiguration: Options = {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    }

    return testConfiguration
  }

  const configuration: Options = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10
    }
    //  operatorsAliases: false
  }

  return configuration
}

export = getConfiguration
