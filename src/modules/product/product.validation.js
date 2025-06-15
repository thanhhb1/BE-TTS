import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required(),
  category_id: Joi.string().required(),
  origin: Joi.string().optional(),
  description: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  size: Joi.string().optional(),
  fragrance: Joi.string().optional(),
  hair_type: Joi.string().optional(),
  stock_quantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required(),
  discount_price: Joi.number().min(0).optional(),
  variation_status: Joi.boolean().optional(),
});