import Joi from '@hapi/joi'

export default Joi.object({
  etablissement: Joi.string().required(),
  userId: Joi.string().required()
})
