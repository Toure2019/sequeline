/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number().required(),
  bupc: Joi.string()
    .min(1)
    .max(45)
    .required(),
  code: Joi.string()
    .min(1)
    .max(45)
    .required(),
  nom: Joi.string()
    .min(1)
    .max(200),
  visible: Joi.number()
    .integer()
    .min(0)
    .max(1),
  codeEtablissement: Joi.string().required(),
  departements: Joi.array(),
  departementsClient: Joi.array()
})
