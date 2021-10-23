/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id_field: Joi.string()
    .min(1)
    .max(45)
    .required(),
  t_etablissement_code: Joi.string().required(),
  libelle_rapport: Joi.string(),
  libelle_settings: Joi.string(),
  display_in_rapport: Joi.number()
    .min(0)
    .max(1),
  display_in_settings: Joi.number()
    .min(0)
    .max(1),
  enable_in_rapport: Joi.number()
    .min(0)
    .max(1),
  enable_in_settings: Joi.number()
    .min(0)
    .max(1),
  position_in_settings: Joi.number()
    .min(-2)
    .max(2),
  position_in_rapport: Joi.number()
    .min(-2)
    .max(2),
  t_evs_group_rapport_id: Joi.number(),
  t_evs_group_settings_id: Joi.number(),
  forSettings: Joi.number()
    .min(0)
    .max(1),
  forRapport: Joi.number()
    .min(0)
    .max(1)
})
