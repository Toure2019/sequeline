/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  annee: Joi.number(),
  mois: Joi.number(),
  num_semaine: Joi.number(),
  active: Joi.bool()
})
