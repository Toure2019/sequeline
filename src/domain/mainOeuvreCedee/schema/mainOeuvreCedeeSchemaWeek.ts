/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  num_semaine: Joi.number().required(),
  annee: Joi.number().required(),
  t_uo_code: Joi.string().required(),
  t_user_id: Joi.number().required(),
  libelle_uo: Joi.string().allow(null).optional(),
  commentaire: Joi.string().allow(null).optional(),
  allMainOeuvreDay: Joi.array().allow(null).optional()
})