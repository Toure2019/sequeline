/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  t_rg_code: Joi.string()
    .min(1)
    .max(45)
    .required(),
  rg_type: Joi.string()
    .alphanum()
    .min(1)
    .max(45)
})
