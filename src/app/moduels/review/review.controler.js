import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { reviewModel } from "../../../db/models/review.model.js";
import { orderModel } from "../../../db/models/order.model.js";
import { productModel } from "../../../db/models/product.model.js";


export const getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await reviewModel.find({productId:req.params.productId})
    return res.json({ msg: 'reviews fetched', reviews })
})


export const createReview = asyncHandler(async (req, res, next) => {
    const {comment , rate  } = req.body
    // product exist , prouductId correct
    let {productId} = req.params
    let product = await productModel.findById(productId)
    if(!product){
        next(new AppError( 'product not found', 404))
    }
    // not duplicated review
    let reviewExist = await reviewModel.findOne({product : productId , user : req.user._id})
    if(reviewExist){
        next(new AppError( 'review already exists', 400))
    }
    // user alredy try product by ordering it
    let order = await orderModel.findOne({"products.productId" : productId , user : req.user._id})
    // order.status must be delvered but i do that for test
    if(!order){
        next(new AppError('order not found', 404))
    }


    let review = await reviewModel.create({user : req.user._id , productId , comment , rate})
    req.data = {model :reviewModel , id :review._id}
    // update product rate
    product.rateCount++
    product.rateTotal += Number(rate)
    product.rateAvg = product.rateTotal/product.rateCount
    await product.save()


    res.status(201).json({ msg: 'review added',review })
})

export const deleteReview = asyncHandler(async (req, res, next) => {
    let {productId} = req.params
    let review = await reviewModel.findOneAndDelete({user : req.user._id , productId})
    if(!review){
        next(new AppError( 'review not found', 404))
    }

    let product = await productModel.findById(productId)
    product.rateCount--
    product.rateTotal -= Number(review.rate)
    product.rateAvg = Number(product.rateTotal/product.rateCount) || 0 
    await product.save()
    return res.json({ msg: 'review deleted' })
})
