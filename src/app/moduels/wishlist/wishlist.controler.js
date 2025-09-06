import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { productModel } from "../../../db/models/product.model.js";
import { wishListModel } from "../../../db/models/wishList.model.js";
import axios from "axios";



export const removeFromwishList = asyncHandler(async (req, res, next) => {
    let {productId} = req.params

    let product = await productModel.findById(productId)

    if(!product){
        next(new AppError( 'product not found', 404))
    }

    let wishList = await wishListModel.findOneAndUpdate({user : req.user._id  , "products" : productId}, {$pull: {products: productId}}, {new: true})

    if (!wishList) {
        next(new AppError('wishList not found', 404))
    }

    
    if(wishList.products.length == 0){
        await wishListModel.deleteOne({user : req.user._id})
    }

    res.json({ msg: 'done', wishList })
})

export const getWishList = asyncHandler(async (req, res, next) => {
    const wishList = await wishListModel.findOne({user: req.user._id})
    return res.json({ msg: 'done', wishList })
})


export const createWishList = asyncHandler(async (req, res, next) => {
    const { productId  } = req.body  

    let product = await productModel.findOne({_id:productId })
    if(!product){
        next(new AppError( 'product not found', 404))
    }

    let wishList = await wishListModel.findOneAndUpdate({user : req.user._id} , {$addToSet: {products: productId}}, {new: true})
    if (!wishList){
        wishList = await wishListModel.create({
            user: req.user._id,
            products: [productId]
        })
        
        req.data = {model : wishListModel , id : wishList._id}
    }


    res.status(201).json({ msg: 'product added to wishList' , wishList})
})


export const toCart = asyncHandler(async (req, res, next) => {
    let {productId} = req.params
    let product = await productModel.findById(productId)
    if(!product){
        return next(new AppError( 'product not found', 404))
    }

    let data =  await axios.post(`${req.protocol}://${req.headers.host}/cart/` , {productId , quantity:1} , {headers : {token : req.headers.token}})
    if(data.data.msg != "product added to cart"){
        return next(new AppError( 'added failed', 404))
    }

    let wishList = await wishListModel.findOneAndUpdate({user : req.user._id  , "products" : productId},
        {$pull: {products: productId}},
        {new: true})

    if (!wishList) {
        return next(new AppError('wishList not found', 404))
    }

    if(wishList.products.length == 0){
        await wishListModel.deleteOne({user : req.user._id})
    }

    
    
    return res.json({ msg: 'done', wishList })
})



