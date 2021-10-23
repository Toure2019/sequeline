/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

const objectSchema = Joi.object({
  t_inter_chantier_id: Joi.number(),
  t_engin_id: Joi.number(),
  date: Joi.date(),
  value: Joi.string()
})

export default Joi.array().items(objectSchema)