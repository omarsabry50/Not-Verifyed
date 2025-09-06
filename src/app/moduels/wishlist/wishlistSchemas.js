import glopalSchema from "../../glopalMiddelWares/glopalSchema.js";
import joi from 'joi'

export const createWhisListSchema = {
    body: joi.object({
        productId : glopalSchema.id.required()
    }),

    headers: glopalSchema.headers.required(),

}

