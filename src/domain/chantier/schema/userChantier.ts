/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

const objectSchema = Joi.object({
  t_inter_chantier_id: Joi.number(),
  t_user_planning_date: Joi.date(),
  t_user_planning_t_user_id: Joi.number(),
  duration: Joi.string(),
  old: Joi.number()
})

export default Joi.array().items(objectSchema)
