import joi from 'joi';
import glopalSchema from '../../glopalMiddelWares/glopalSchema.js';


export const signUpSchema = {
    body :joi.object({
        name: joi.string().alphanum().min(3).max(30).required(),
        email: glopalSchema.email.required(),
        password: glopalSchema.password.required(),
        age: joi.number().min(18).integer().required(),
        phones: joi.array().items(joi.string().regex(/^01\d{9,10}$/)),
        adress: joi.array().items(joi.string()),
        role:joi.string().valid("user", "admin"),
    })
};

export const loginSchema = {
    body :joi.object({
        email: glopalSchema.email.required(),
        password: glopalSchema.password.required()
    })
}

export const updatePasswordSchema = {
    body :joi.object({
        password: glopalSchema.password.required(),
        newPassword: glopalSchema.password.required()
    }),
    headers: glopalSchema.headers
}

export const updateUserSchema = {
    body :joi.object({
        name: joi.string().alphanum().min(3).max(30),
        email: glopalSchema.email,
        age: joi.number().min(18).integer(),
        phones: joi.array().items(joi.string().regex(/^01\d{9,10}$/)),
        adress: joi.array().items(joi.string()),
        role:joi.string().valid("user", "admin"),
    }),
    headers: glopalSchema.headers
}

export const resetPasswordSchema = {
    body :joi.object({
        password: glopalSchema.password,
        code : joi.string().required()

    })
}

export const deleteSchema = {
    headers: glopalSchema.headers
}