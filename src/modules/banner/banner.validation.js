import Joi from 'joi';

export const bannerSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  imageUrl: Joi.string().uri().required(),
  link: Joi.string().uri().optional().allow(''),
  isActive: Joi.boolean().optional(),
});
