import { QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
    'ALTER TABLE planning ALTER COLUMN date TYPE date;'
    )
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
        'ALTER TABLE planning ALTER COLUMN date TYPE timestampz;'
    )
  }
}
