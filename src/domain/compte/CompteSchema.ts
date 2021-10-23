/* eslint-disable @typescript-eslint/camelcase */
import Joi from '@hapi/joi'

export default Joi.object({
  id: Joi.number(),
  t_type_compte_id: Joi.number(),
  t_etablissement_code: Joi.string().allow(null),
  t_specialite_id: Joi.number(),
  nom: Joi.string()
    .min(1)
    .max(45),
  designation: Joi.string().allow(''),
  activite: Joi.string()
    .min(1)
    .max(45),
  projet: Joi.string()
    .min(1)
    .max(45),
  pc: Joi.string()
    .min(1)
    .max(45),
  code_uop: Joi.string().allow(''),
  need_rapport: Joi.number()
    .min(0)
    .max(1),
  localisable: Joi.number()
    .min(0)
    .max(1),
  mobilite: Joi.number()
    .min(0)
    .max(1),
  filtre: Joi.string()
    .min(1)
    .max(45),
  t_profil_id: Joi.number(),
  visible: Joi.number()
    .min(0)
    .max(1),
  sous_categorie: Joi.string().allow(''),
  no_productif: Joi.number(),
  qte_uo_max_day: Joi.number().allow(null),
  qte_uo_max_week: Joi.number().allow(null),
  cpt_intermediaire: Joi.number(),
  cpt_intermediaire_is_set: Joi.number(),
  from_erp: Joi.number(),
  filtres: Joi.array()
})
