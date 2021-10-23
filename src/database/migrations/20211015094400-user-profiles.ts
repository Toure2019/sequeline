import { QueryInterface } from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
    `
          CREATE TYPE public.SCOPE_TYPE AS ENUM ('ALL', 'ETABLISSEMENT', 'UO_AND_CHILD', 'UO_ASSISTANT_AND_CHILD', 'UO_VP', 'EQUIPE', 'AGENT');
          CREATE SEQUENCE public.t_profiles_seq
          START WITH 1
          INCREMENT BY 1
          NO MINVALUE
          NO MAXVALUE
          CACHE 1;

          CREATE TABLE t_profiles (
          id INT DEFAULT nextval('public.t_profiles_seq'::regclass) NOT NULL,
          index SMALLINT NOT NULL,
          name VARCHAR(45),
          scope SCOPE_TYPE,
          enabled SMALLINT DEFAULT 1);

          ALTER TABLE ONLY public.t_profiles
          ADD CONSTRAINT t_profiles_pkey PRIMARY KEY (id);
          CREATE INDEX t_profiles_index_idx ON public.t_profiles USING btree (index);
          ALTER TABLE ONLY public.t_profiles
          ADD CONSTRAINT t_profiles_index_level_ukey UNIQUE (index, scope);

          INSERT INTO t_profiles
          (index, name, scope, enabled)
          VALUES
          (1, 'Super User',                   'ALL',                    1),
          (2, 'Valideur Niv. 9',              'UO_AND_CHILD',           1),
          (2, 'Assistant Niv. 9',             'UO_ASSISTANT_AND_CHILD', 1),
          (3, 'Valideur Niv. 10',             'UO_AND_CHILD',           1),
          (3, 'Assistant Niv. 10',            'UO_ASSISTANT_AND_CHILD', 1),
          (5, 'Responsable',                  'EQUIPE',                 1),
          (6, 'Agent',                        'AGENT',                  1),
          (6, 'Valideur Niv. 11',             'UO_AND_CHILD',           1),
          (6, 'Assistant Niv. 11',            'UO_ASSISTANT_AND_CHILD', 1),
          (7, 'GU',                           'ETABLISSEMENT',          1),
          (9, 'Administrateur comptable',     'ETABLISSEMENT',          1),
          (10, 'Valideur Niv. 8',             'UO_AND_CHILD',           1),
          (10, 'Assistant Niv. 8',            'UO_ASSISTANT_AND_CHILD', 1),
          (11, 'Administrateur RH',           'ETABLISSEMENT',          1),
          (12, 'Vérificateur de production',  'UO_VP',                  1);

          CREATE TABLE t_user_profiles (
            t_user_id INT NOT NULL,
            t_profiles_id INT NOT NULL,
            scope_id INT NOT NULL
          );
        `
    )
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.dropTable('t_user_profiles'),
      queryInterface.dropTable('t_profiles'),
    ])
  }
}
