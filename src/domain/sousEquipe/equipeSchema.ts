/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number(),
  num_equipe: Joi.string()
    .min(1)
    .max(45),
  nom: Joi.string()
    .min(1)
    .max(45),
  t_uo_code: Joi.string()
    .alphanum()
    .max(45),
  t_user_id_create: Joi.number(),
  spot_equipe: Joi.string()
    .allow('')
    .max(45),
  search: Joi.string().alphanum(),
  t_departement_code: Joi.string()
    .alphanum()
    .min(1)
    .max(45),
  date_end: Joi.date().allow('', null)
})
