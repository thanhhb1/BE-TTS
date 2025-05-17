
import Joi from "joi";
import mongoose from "mongoose";

export const userValid = Joi.object({
  fullname: Joi.string().min(3).max(255).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Email không hợp lệ',
  }),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ',
  }),
  role_id: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("role_id không hợp lệ");
    }
    return value;
  }),
  status: Joi.boolean(),
});
