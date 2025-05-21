
import Joi from "joi";


export const userValid = Joi.object({
  fullname: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
  }),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ',
  }),
  role: Joi.string().valid('admin', 'user', 'manage').required(),
  status: Joi.boolean(),
});

export const roleValid = Joi.object({
  role: Joi.string().valid('admin', 'user', 'manage').required()
}).unknown(true);
