import Joi from "joi";

export const couponValid = Joi.object({
    code: Joi.string().trim().required(),
    discount_type: Joi.boolean().required(),
    discount: Joi.number().positive().required().when('discount_type', {
        is: true,
        then: Joi.number().max(100),
        otherwise: Joi.number()
    }),
    start_date: Joi.date().required(),
    expiration_date: Joi.date().greater(Joi.ref('start_date')).required(),
    max_uses: Joi.number().integer().positive().optional(),
    isActive: Joi.boolean().optional().default(true),
});
