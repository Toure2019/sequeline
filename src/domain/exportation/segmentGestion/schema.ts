import Joi from '@hapi/joi'

export default Joi.object({
  etablissement: Joi.string().required()
})
