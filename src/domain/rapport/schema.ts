/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
    id: Joi.number().allow(null).optional(),
    t_inter_chantier_id: Joi.number()
        .required(),
    date_rapport: Joi.date().required(),
    t_user_id: Joi.number().required(),
    voie: Joi.string().required(),
    kmDebut: Joi.string().allow(''),
    kmFin: Joi.string().allow(''),
    uop: Joi.number().required(),
    observation: Joi.string().allow(''),
    motif: Joi.string().allow(''),
    attachement: Joi.string().allow(''),
    ressourceEntreprise: Joi.array(),
    ressourceEntrepriseExt: Joi.array(),
    extautres: Joi.string().allow(''),
    procedures: Joi.array().allow(null).optional(),
    activites: Joi.array().allow(null).optional()
})
