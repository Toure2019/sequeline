import { QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
    'ALTER TABLE t_user_inter_chantier ALTER COLUMN t_user_planning_date TYPE date;'
    )
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
        'ALTER TABLE t_user_inter_chantier ALTER COLUMN t_user_planning_date TYPE timestamp;'
    )
  }
}
