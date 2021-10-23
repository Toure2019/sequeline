/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  date: Joi.date().required(),
  t_uo_code: Joi.string().required(),
  t_user_id: Joi.number().required(),
  duration: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/).required(),
  commentaire: Joi.string().allow(null).optional()
})