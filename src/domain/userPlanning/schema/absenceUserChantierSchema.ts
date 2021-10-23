/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  date: Joi.date(),
  t_code_absence_id: Joi.number(),
  t_user_id: Joi.number(),
  duration: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
})
