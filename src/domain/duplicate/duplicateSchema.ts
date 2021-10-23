/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
    dateSource: Joi.date().required(),
    dateTarget: Joi.date().required(),
    agentSource: Joi.number().required(),
    agentCibles: Joi.array().required(),
    codeAbsences: Joi.boolean().required(),
    horaires: Joi.boolean().required(),
    evp: Joi.boolean().required(),
    deplacements: Joi.boolean().required(),
    chantierHeures: Joi.boolean().required(),
    chantierSansHeures: Joi.boolean().required(),
})