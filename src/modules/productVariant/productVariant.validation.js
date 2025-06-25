import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createVariantSchema = Joi.object({
  product_id: Joi.string()
    .pattern(objectIdRegex)
    .required()
    .messages({
      'string.pattern.base': 'product_id không hợp lệ',
      'any.required': 'product_id là bắt buộc',
    }),
image: Joi.string().uri().required(),
  images: Joi.array()
    .items(Joi.string().uri().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'images phải là một mảng',
      'array.min': 'Phải có ít nhất một ảnh',
    }),

  size: Joi.string().max(50).optional(),

  fragrance: Joi.string().max(100).optional(),

  hair_type: Joi.string().max(100).optional(),

  stock_quantity: Joi.number().integer().min(0).default(0),

  price: Joi.number().min(0).optional(),

  discount_price: Joi.number().min(0).optional(),

  variant_status: Joi.boolean().optional(),

  isDeleted: Joi.boolean().optional(),
});

export const updateVariantSchema = Joi.object({
  product_id: Joi.string()
    .pattern(objectIdRegex)
    .messages({
      'string.pattern.base': 'product_id không hợp lệ',
    }),
    
  image: Joi.string().uri().optional(),
  images: Joi.array()
    .items(Joi.string().uri().required())
    .messages({
      'array.base': 'images phải là một mảng',
    }),

  size: Joi.string().max(50).optional(),

  fragrance: Joi.string().max(100).optional(),

  hair_type: Joi.string().max(100).optional(),

  stock_quantity: Joi.number().integer().min(0).optional(),

  price: Joi.number().min(0).optional(),

  discount_price: Joi.number().min(0).optional(),

  variant_status: Joi.boolean().optional(),

  isDeleted: Joi.boolean().optional(),
}).min(1); // Đảm bảo có ít nhất 1 trường được cập nhật
