import { QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
  `CREATE TABLE planning (
          id SERIAL PRIMARY KEY,
          id_t_user INT NOT NULL,
          date TIMESTAMPTZ NOT NULL,
          id_t_code_hours_prevision INT NOT NULL,
          id_t_code_hours_final INT,

          FOREIGN KEY (id_t_user)
              REFERENCES t_user (id),
          FOREIGN KEY (id_t_code_hours_prevision)
              REFERENCES t_code_hours_absence (id),
          FOREIGN KEY (id_t_code_hours_final)
              REFERENCES t_code_hours_absence (id)
          )`
    )
},

  down: (queryInterface: QueryInterface) => {
    return Promise.all([queryInterface.dropTable('planning')])
  }
}
