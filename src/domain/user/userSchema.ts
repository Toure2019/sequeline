/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  userId: Joi.number().required(),
  enabled: Joi.number()
    .min(0)
    .max(1),
  role: Joi.string(),
  uo: Joi.string(),
  codeRessource: Joi.string(),
  sousEquipe: Joi.number(),
  typeValidation: Joi.number(),
  uoValidation: Joi.string().max(45),
  mail: Joi.string().email().allow('').max(200),
  phone: Joi.string().allow('').max(20)
})
