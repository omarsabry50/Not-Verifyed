import jwt from 'jsonwebtoken'
import main from './../services/sendEmail.js'
import dotenv from 'dotenv'

dotenv.config()

export default async (req, email) => {
    let token = jwt.sign({ email }, process.env.SECRET, { expiresIn: 60 * 2 })
    let url = `${req.protocol}://${req.headers.host}/user/verfiy/${token}`
    let reToken = jwt.sign({ email }, process.env.SECRET)
    let reUrl = `${req.protocol}://${req.headers.host}/user/reVerfiy/${reToken}`
    await main(email, `<h1>verfiy your email</h1>
    <br/>
    <a href="${url}">click here</a>
    <br/>
        <h6> if expired resend <h6/>
    <br/>
    <a href="${reUrl}">click here</a>`
        ,
        "Verfication email"
    )
}

