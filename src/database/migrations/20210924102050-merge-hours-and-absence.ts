import {QueryInterface} from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
  `CREATE TABLE t_code_hours_absence (
      id SERIAL PRIMARY KEY,
      code_hour VARCHAR(10),
      duree_coupures INT,
      duree_pauses INT,
      duree_journee INT,
      code_t_etablissement VARCHAR(45) NOT NULL,
      range_slots_hourlybreak JSON,

      id_t_compte INT,
      nom VARCHAR(45),
      journalier SMALLINT,
      visible SMALLINT
      );`
    )
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([queryInterface.dropTable('t_code_hours_absence')])
  }
}
