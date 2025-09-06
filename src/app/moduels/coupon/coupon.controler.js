import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { couponModel } from "../../../db/models/coupon.model.js";


export const getCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await couponModel.find()
    res.json({ msg: 'coupons fetched', coupons })
})

export const deleteCoupon = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    const coupon = await couponModel.findOneAndDelete({_id:id , createdBy:req.user._id})

    if (!coupon) {
        next(new AppError('coupon not found', 404))
    }



    res.json({ msg: 'done', coupon })
})

export const getCoupon = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    const copoun = await couponModel.findById(id)
    res.json({ msg: 'done', copoun })
})

export const createCoupon = asyncHandler(async (req, res, next) => {
    const { amount , fromDate , toDate , code } = req.body

    if(await couponModel.findOne({ code})){
        next(new AppError( 'coupon code already exists', 400))
    }


    const coupon = await couponModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id,
    })

    req.data = {model : couponModel , id : coupon._id}


    res.status(201).json({ msg: 'coupon created', coupon })
})

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { amount , fromDate , toDate , code } = req.body
    let {id} = req.params
    let coupon = await couponModel.findOne({_id:id , createdBy : req.user._id})
    if(!coupon){
        next(new AppError( 'coupon not found ', 404))
    }
    

    if(code){
        let codeExist = await couponModel.findOne({ code: code.toLowerCase()})

        if(codeExist){
            next(new AppError( 'coupon code already exists', 400))
        }

        coupon.code = code
    }

    if(amount){
        coupon.amount = amount
    }

    if(fromDate){
        if(new Date(fromDate) > new Date(coupon.toDate)){
            next(new AppError('fromDate should be less than toDate', 400))
        }
            coupon.fromDate = fromDate
    }

    if(toDate){
        if(new Date(toDate) < new Date(coupon.fromDate)){
            next(new AppError('toDate should be greater than fromDate', 400))
        }
        coupon.toDate = toDate
    }

   


    await coupon.save()

    return res.json({ msg: 'coupon updated', coupon })
})