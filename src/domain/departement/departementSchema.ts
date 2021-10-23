/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  code: Joi.string()
    .min(1)
    .max(45)
    .required(),
  libelle: Joi.string()
    .alphanum()
    .min(1)
    .max(200),
  libelle_min: Joi.string()
    .alphanum()
    .min(1)
    .max(50),
  date_effet: Joi.date(),
  date_effet_end: Joi.date(),
  t_rg_code: Joi.string()
    .alphanum()
    .min(1)
    .max(45),
  enabled: Joi.number()
    .max(1)
    .min(0)
})
