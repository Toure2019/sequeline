/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number(),
  libelle: Joi.string(),
  grp: Joi.string(),
  position: Joi.string(),
  display: Joi.number(),
  t_etablissement_code: Joi.string()
})
