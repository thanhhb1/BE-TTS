
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



export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});


export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token là bắt buộc',
    'string.empty': 'Token không được để trống',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'any.required': 'Mật khẩu mới là bắt buộc',
    'string.min': 'Mật khẩu mới phải ít nhất 6 ký tự',
    'string.empty': 'Mật khẩu mới không được để trống',
  }),
});