import {QueryInterface} from 'sequelize'

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
      `
      INSERT INTO "t_code_hours_absence"
      ( "code_hour",  "id_t_compte",     "code_t_etablissement",     "nom",                                              "journalier",   "duree_journee",     "visible") VALUES
      (\t'MN - JN',    \t876531,         \t'251207',                 \t'Temps de montée de nuit',                        \t0,            \t0,                  \t1),
      (\t'DA',         \t876531,         \t'251207',                 \t'Grève d''une durée <1 heure',                    \t0,            \t3540000,            \t1),
      (\t'DB',         \t876531,         \t'251207',                 \t'Grève d''une durée < d''une demi-journée',       \t0,            \t14340000,           \t1),
      (\t'RN',         \t876531,         \t'251207',                 \t'Repos compensateur',                             \t0,            \t0,                  \t1),
      (\t'TC',         \t876531,         \t'251207',                 \t'Temps à compenser mois précédent',               \t0,            \t0,                  \t1),
      (\t'TK',         \t876531,         \t'251207',                 \t'Temps à compenser mois en cours',                \t0,            \t0,                  \t1),
      (\t'TQ',         \t876531,         \t'251207',                 \t'Temps à compenser semestre en cours',            \t0,            \t0,                  \t1),
      (\t'TY',         \t876531,         \t'251207',                 \t'Temps à compenser semestre précédent',           \t0,            \t0,                  \t1),
      (\t'1/2 C',      \t876531,         \t'251207',                 \t'1/2 Congés',                                     \t0,            \t14400000,           \t1),
      (\t'RS',         \t876531,         \t'251207',                 \t'Repos d''astreinte',                             \t0,            \t14400000,           \t1),
      (\t'TEST',       \t876531,         \t'455600',                 \t'test',                                           \t0,            \t14400000,           \t1),
      (\t'TEST2',      \t876531,         \t'455600',                 \t'test',                                           \t0,            \t14400000,           \t1),
      (\t'AZ',         \t876531,         \t'251207',                 \t'Congé Paternité',                                \t1,            \t27900000,           \t1),
      (\t'AN',         \t876531,         \t'452201',                 \t'Congé naissance',                                \t1,            \t27900000,           \t1),
      (\t'AY',         \t876531,         \t'452201',                 \t'Chèque congé',                                   \t1,            \t27900000,           \t1),
      (\t'BA',         \t876531,         \t'452201',                 \t'Blessure en service',                            \t1,            \t27900000,           \t1),
      (\t'BT',         \t876531,         \t'452201',                 \t'Blessure en trajet',                             \t1,            \t27900000,           \t1),
      (\t'C',          \t876531,         \t'452201',                 \t'Congé annuel',                                   \t1,            \t27900000,           \t1),
      (\t'CF',         \t876531,         \t'452201',                 \t'Congé soin à famille',                           \t1,            \t27900000,           \t1),
      (\t'CS',         \t876531,         \t'452201',                 \t'Congé supplémentaire',                           \t1,            \t27900000,           \t1),
      (\t'DC',         \t862777,         \t'452201',                 \t'Grève d''une journée',                           \t1,            \t27900000,           \t1),
      (\t'F',          \t862777,         \t'452201',                 \t'Repos férié',                                    \t1,            \t27900000,           \t1),
      (\t'FJGENE',     \t862777,         \t'452201',                 \t'Forfait Jour',                                   \t1,            \t27900000,           \t1),
      (\t'HA',         \t862777,         \t'452201',                 \t'Absence irrégulière',                            \t1,            \t27900000,           \t1),
      (\t'MA',         \t862777,         \t'452201',                 \t'Maladie',                                        \t1,            \t27900000,           \t1),
      (\t'RA',         \t862777,         \t'452201',                 \t'Repos de derangement A-1',                       \t1,            \t27900000,           \t1),
      (\t'RE',         \t862777,         \t'452201',                 \t'Repos supplémentaire (Forfait Jour)',            \t1,            \t27900000,           \t1),
      (\t'RQ',         \t862777,         \t'452201',                 \t'Repos supplémentaire (régime hors TS B10)',      \t1,            \t27900000,           \t1),
      (\t'RU',         \t862777,         \t'452201',                 \t'Repos supplémentaire',                           \t1,            \t27900000,           \t1),
      (\t'SS',         \t862777,         \t'452201',                 \t'Jour sans solde',                                \t1,            \t27900000,           \t1),
      (\t'UM',         \t862777,         \t'452201',                 \t'Mise à pied',                                    \t1,            \t27900000,           \t1),
      (\t'VN',         \t862777,         \t'452201',                 \t'Veille de Noel',                                 \t1,            \t27900000,           \t1),
      (\t'VT',         \t862777,         \t'452201',                 \t'Jour non travaillé des agents à temps parti',    \t1,            \t27900000,           \t1),
      (\t'DR - CSSCT', \t862777,         \t'452201',                 \t'Convocation à l''initiative de l''ent. CSSCT',   \t0,            \t0,                  \t1),
      (\t'DR - RPX',   \t862777,         \t'452201',                 \t'Convocation à l''initiative de l''ent. RPX',     \t0,            \t0,                  \t1),
      (\t'DR - CSE',   \t862777,         \t'452201',                 \t'Convocation à l''initiative de l''ent. CSE',     \t0,            \t0,                  \t1),
      (\t'DD',         \t863461,         \t'452201',                 \t'Crédit d''heure Délégation Représentation',      \t0,            \t0,                  \t1),
      (\t'AC',         \t863461,         \t'452201',                 \t'Congé médaille',                                 \t1,            \t27900000,           \t1),
      (\t'RE',         \t863461,         \t'452706',                 \t'Repos forfait jour 205',                         \t1,            \t27900000,           \t1),
      (\t'WO',         \t863461,         \t'452706',                 \t'Absence CET compte courant',                     \t1,            \t27900000,           \t1),
      (\t'RP',         \t863461,         \t'251207',                 \t'Repos périodique',                               \t1,            \t27900000,           \t1),
      (\t'SSS',        \t863461,         \t'251207',                 \t'sans solde',                                     \t0,            \t0,                  \t1),
      (\t'TI',         \t863461,         \t'452201',                 \t'Temps d''insuffisance',                          \t0,            \t0,                  \t1),
      (\t'TEST',       \t863461,         \t'452706',                 \t'test',                                           \t0,            \t14340000,           \tNULL);
      `
    )
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
      'TRUNCATE TABLE t_code_hours_absence;'
    )
  },
}
