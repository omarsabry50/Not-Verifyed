import glopalSchema from "../../glopalMiddelWares/glopalSchema.js";
import joi from 'joi'

export const createOrderSchema = {
    body: joi.object({
        productId : glopalSchema.id,
        quantity : joi.number().min(1),
        phone: joi.number().required(),
        address : joi.string().required(),
        paymentMethod : joi.string().valid("cash","card").required(),
        couponCode: joi.string(),
    }),

    headers: glopalSchema.headers.required(),

}

export const cancelOrderSchema = {
    body: joi.object({
        reason : joi.string().min(5).required()
    }),

    params : joi.object({
        id: glopalSchema.id.required(),
    }),
    headers: glopalSchema.headers.required(),
} 