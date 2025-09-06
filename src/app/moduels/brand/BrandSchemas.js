import glopalSchema from "../../glopalMiddelWares/glopalSchema.js";
import joi from 'joi'

export const createBrandSchema = {
    body: joi.object({
        name: joi.string().required(),
    }),

    headers: glopalSchema.headers.required(),

    file:glopalSchema.file.required()
} 

export const updateBrandSchema = {
    body: joi.object({
        name: joi.string(),
    }),
    headers: glopalSchema.headers,
    file:glopalSchema.file
} 
