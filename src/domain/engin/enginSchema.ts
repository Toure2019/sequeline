/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number(),
  code: Joi.string()
    .min(1)
    .max(45)
    .required(),
  libelle: Joi.string()
    .min(1)
    .max(150),
  unite: Joi.number(),
  statut: Joi.number()
})
