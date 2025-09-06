import { v2 as cloudinary } from 'cloudinary';
import { couponModel } from '../../db/models/coupon.model.js';


export default (cb)=>{
    return (req,res,next)=>{
        cb(req,res,next).catch(err=>{
            next(err);
        })
    }
}


export const glopalErrorHandler = (err,req,res,next)=>{
    
    res.status(err.statusCode || 500).json({message: err.message , stack:err.stack})
    next()
}

export const delteIdFromCopoun = async (req, res, next)=>{
    if(req.body.coupon){
        
        await couponModel.findByIdAndUpdate(req.body.coupon._id , {$pull:{usedBy:req.user._id}})
    }

    next()
}


export const deleteFolder = async (req, res, next)=>{
    if(req.folder){
        await cloudinary.api.delete_resources_by_prefix(req.folder)
        await cloudinary.api.delete_folder(req.folder)

    }
    next()
}

export const deleteFromDB = async (req, res, next)=>{
    if(req.data){
        await req.data.model.findByIdAndDelete(req.data.id)
    }
    return
}   