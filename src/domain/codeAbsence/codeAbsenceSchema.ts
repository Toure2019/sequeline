/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number().optional(),
  code: Joi.string()
    .min(1)
    .max(45)
    .required(),
  t_compte_nom: Joi.string()
    .min(1)
    .max(45),
  t_etablissement_code: Joi.string()
    .min(1)
    .max(45),
  nom: Joi.string()
    .min(1)
    .max(45),
  journalier: Joi.number()
    .min(0)
    .max(1),
  duration: Joi.string(),
  visible: Joi.number()
    .min(0)
    .max(1)
})
