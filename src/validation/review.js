import Joi from "joi";

export const statusValid = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required()
});
