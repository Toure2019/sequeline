import { Sequelize } from 'sequelize'
import configuration from './configuration'

export default new Sequelize(configuration())
