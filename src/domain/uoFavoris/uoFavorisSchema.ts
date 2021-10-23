/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  t_table: Joi.string(),
  t_table_id: Joi.string(),
  t_etablissement_code: Joi.string(),
  uos: Joi.array()
})
