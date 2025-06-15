import Joi from 'joi';

export const brandValid  = Joi.object({
  name: Joi.string().trim().required(),
  logo: Joi.string().uri().required(),
  country: Joi.string().required(),
  description: Joi.string().allow(''),
});
