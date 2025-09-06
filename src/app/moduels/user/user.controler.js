import asyncHandler from "../../utils/asyncHandler.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import sendVerfyingEmail from "../../glopalShortCuts/sendVerfyingEmail.js";
import { userModel } from "../../../db/models/user.model.js";
import { nanoid } from "nanoid";
import main from "../../services/sendEmail.js";
dotenv.config()

export const signUp = asyncHandler(async (req, res, next) => {
    let hashed = bcrypt.hashSync(req.body.password, Number(process.env.SALT))
    req.body.password = hashed
    // await sendVerfyingEmail(req, req.body.email)

    let user = await userModel.create(req.body)
    return res.status(200).json({ msg: 'sucsses', user })
})


export const verfiyng = asyncHandler(async (req, res, next) => {
    let { token } = req.params
    let { email } = jwt.verify(token, process.env.SECRET)
    let user = await userModel.findOneAndUpdate({ email, confirmed: false }, { confirmed: true })
    if (!user) {
        return res.status(404).json({ msg: 'user not found or alerdy verfayied' })
    }
    return res.status(200).json({ msg: 'verfiy sucsses' })
})

export const reVerfiyng = asyncHandler(async (req, res, next) => {
    let { reToken } = req.params
    let { email } = jwt.verify(reToken, process.env.SECRET)
    let user = await userModel.findOne({ email, confirmed: false })

    if (!user) {
        return res.status(404).json({ msg: 'user not found or alerdy verfayied' })
    }
    sendVerfyingEmail(req, email)

    return res.status(200).json({ msg: 'reVerfiy sucsses' })
})

export const forgetPassword = asyncHandler(async (req, res, next) => {
    let { email } = req.body
    let user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
    let code = nanoid(5)
    user.code = code
    await user.save()

    main(email, `<h1>your password reset code is ${code}</h1>`,"password reset")

    return res.status(200).json({ msg: 'verfiy sucsses' })
})

export const resetPassword = asyncHandler(async (req, res, next) => {
    let { code, password } = req.body
    let user = await userModel.findOne({ code })
    if (!user) {
        return res.status(404).json({ msg: 'user not found or code is not valid' })
    }
    let hashed = bcrypt.hashSync(password, Number(process.env.SALT))
    user.password = hashed
    user.code = ''
    user.passwordChangedAt = Date.now()
    await user.save()
    return res.status(200).json({ msg: "sucsses" })
})

export const login = asyncHandler(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email.toLowerCase() })
    // if (!user.confirmed) {
    //     return res.status(403).json({ msg: 'email not verfayied' })
    // }
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ msg: 'invalid email or password' })
    }
    let token = jwt.sign({ email: req.body.email }, process.env.SECRET)
    user.loggedIn = true
    await user.save()
    return res.status(200).json({ msg: 'sucsses', token })
})

export const updateUser = asyncHandler(async (req, res, next) => {
    
    if (req.body.email) {
        let emailExist = await userModel.findOne({ email: req.body.email.toLowerCase() })
        if (emailExist && emailExist._id.toString() !== req.user._id.toString()) {
            return res.status(409).json({ msg: 'email already exist' })
        }
        // req.body.confirmed = false
    }

    let user = await userModel.findOneAndUpdate({ email: req.user.email.toLowerCase() }, req.body, { new: true })
    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
    return res.status(200).json({ msg: 'sucsses', user })

})


export const ubdatePassword = asyncHandler(async(req, res, next) => {
    let { password, newPassword } = req.body
    if (!req.user ||!bcrypt.compareSync(password, req.user.password)) {
        return res.status(401).json({ msg: 'invalid old password' })
    }
    let hashed = bcrypt.hashSync(newPassword, Number(process.env.SALT))
    req.user.password = hashed
    req.user.passwordChangedAt = Date.now()
    req.user.name = "laaalala"
    await req.user.save()
    return res.status(200).json({ msg: 'sucsses' })
})

export const deleteUser = asyncHandler(async(req, res, next) => {
    if(req.user.role == 'admin') {
        
    }

    await userModel.findOneAndDelete({email: req.user.email})
    return res.status(200).json({ msg: 'user deleted' })
})