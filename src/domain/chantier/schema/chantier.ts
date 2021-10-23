/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number().optional(),
  t_compte_id: Joi.number(),
  t_compte_erp_id: Joi.number().optional(),
  num_semaine: Joi.number(),
  annee: Joi.number(),
  t_user_id: Joi.number(),
  t_equipe_id: Joi.number().optional(),
  t_segment_gestion_id: Joi.number().optional(),
  t_cpr_id: Joi.number().optional(),
  client_link: Joi.string().allow('').optional(),
  t_engin_id: Joi.number().optional(),
  clos: Joi.string().allow('').optional(),
  rg_pointage: Joi.string().allow('').optional(),
  axe_local: Joi.string().allow('').optional(),
  commentaire: Joi.string().allow('').optional()
})
