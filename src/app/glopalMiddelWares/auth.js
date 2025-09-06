import jwt from 'jsonwebtoken'
import { userModel } from '../../db/models/user.model.js'
import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'

export default (roles = ["user"])=>{
    return asyncHandler(
        async (req,res,next)=>{
            let {token} = req.headers

            if(!token){
                next(new AppError('token must provided',500))
            }

            let decoded = jwt.verify(token, process.env.SECRET)
            if(!decoded.email){
                next(new AppError('wrong token',404))
            }
            req.user = await userModel.findOne({email:decoded.email})
            if(!req.user){
                next(new AppError('user not found' , 404))
            }
    
            if(!roles.includes(req.user.role)){
                next(new AppError('unauthorized' , 401))
            }
    
            if(req.user?.passwordChangedAt){
                if(passwordChangedAt > decoded.iat){
                    next(new AppError('password has been changed log in again' , 401))
                }
            }
    
            next()
    
        }
    )
}