import glopalSchema from "../../glopalMiddelWares/glopalSchema.js";
import joi from 'joi'

export const createReviewSchema = {
    body: joi.object({
        comment : joi.string().min(3).max(30).required(),
        rate:joi.number().min(1).max(5).required(),
    }),

    headers: glopalSchema.headers.required(),

 

}