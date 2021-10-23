import Joi from '@hapi/joi'

export default Joi.object({
  login: Joi.string()
    .min(6)
    .max(45)
    .required().
    messages({
      'string.base': 'L\'identifiant doit être une chaîne de caractères',
      'string.empty': 'Veuillez indiquer votre identifiant',
      'string.min': 'Votre identifiant doit contenir au minimum {#limit} caractères',
      'string.max': 'Votre identifiant doit contenir au maximum {#limit} caractères',
      'any.required': 'Veuillez indiquer votre identifiant'
    }),

  password: Joi.string()
    .min(6)
    .max(45)
    .required().
    messages({
      'string.base': 'Le mot de passe doit être une chaîne de caractères',
      'string.empty': 'Veuillez indiquer votre mot de passe',
      'string.min': 'Votre mot de passe doit contenir au minimum {#limit} caractères',
      'string.max': 'Votre mot de passe doit contenir au maximum {#limit} caractères',
      'any.required': 'Veuillez indiquer votre mot de passe'
    })
})
