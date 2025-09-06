import glopalSchema from "../../glopalMiddelWares/glopalSchema.js";
import joi from 'joi'

export const createCouponSchema = {
    body: joi.object({
        code : joi.string().min(3).max(30).required(),
        amount:joi.number().min(1).max(100).required(),
        fromDate : joi.date().greater(Date.now()).required(),
        toDate: joi.date().greater(joi.ref('fromDate')).required()
    }),

    headers: glopalSchema.headers.required(),

}

export const updateCopounSchema = {
    body: joi.object({
        code : joi.string().min(3).max(30),
        amount:joi.number().min(1).max(100),
        fromDate : joi.date().greater(Date.now()),
        toDate: joi.date().greater(joi.ref('fromDate'))
    }),

    headers: glopalSchema.headers.required(),
} 