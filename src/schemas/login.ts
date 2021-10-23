import Joi from '@hapi/joi'
import JoiValidator from '@wastimy/joi-middleware'

const loginSchema = Joi.object().keys({
  login: Joi.string().required(),
  password: Joi.string().required(),
}).required()

export default new JoiValidator(loginSchema, 'body', { stripUnknown: true }).validate
