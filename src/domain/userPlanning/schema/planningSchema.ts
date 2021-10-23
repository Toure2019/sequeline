/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

const objectSchema = Joi.object({
  start: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/),
  end: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)
})

export default Joi.object({
  userId: Joi.number().required(),
  date: Joi.string()
    .isoDate()
    .required(),
  codeHour: Joi.string()
    .allow('')
    .required(),

  detachDuration: Joi.number().min(0),
  codeHourRecup: Joi.string().allow(''),
  hours: Joi.array()
    .allow(null)
    .items(objectSchema)
    .unique()
})
