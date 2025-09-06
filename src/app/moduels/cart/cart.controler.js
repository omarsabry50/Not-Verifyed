import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { productModel } from "../../../db/models/product.model.js";
import { cartModel } from "../../../db/models/cart.model.js";
import main from "../../services/sendEmail.js";



export const removeFromCart = asyncHandler(async (req, res, next) => {
    let {productId} = req.params

    let product = await productModel.findById(productId)

    if(!product){
        next(new AppError( 'product not found', 404))
    }

    let cart = await cartModel.findOneAndUpdate({user : req.user._id  , "products.productId" : productId}, {$pull: {products: {productId}}}, {new: true})

    if (!cart) {
        next(new AppError('cart not found', 404))
    }

    
    if(cart.products.length == 0){
        await cartModel.deleteOne({user : req.user._id})
    }

    res.json({ msg: 'done', cart })
})

export const getCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({user: req.user._id})
    res.json({ msg: 'done', cart })
})

export const createCart = asyncHandler(async (req, res, next) => {
    const { productId , quantity } = req.body  

    let product = await productModel.findOne({_id:productId , stock : {$gte:quantity}})
    if(!product){
        next(new AppError( 'product not found', 404))
    }

    let cartExist = await cartModel.findOne({user : req.user._id})


    if (cartExist){
        let productExist = cartExist.products.find(p => p.productId == productId)

        if(productExist){
            productExist.quantity += Number(quantity)
            cartExist.save()
            return res.json({ msg: 'product added to cart', cartExist })
        }

        cartExist.products.push({productId, quantity:Number(quantity)})
        cartExist.save()
        return res.json({ msg: 'product added to cart', cartExist })
    }



    const cart = await cartModel.create({
        user: req.user._id,
        products: [{productId, quantity : Number(quantity) }]
    })

    req.data = {model : cartModel , id : cart._id}


    res.status(201).json({ msg: 'product added to cart' , cart})
})

export const clearCart = asyncHandler(async (req, res, next) => {

   let cart = await cartModel.findOneAndDelete({user: req.user._id})
    if(!cart){
        return next(new AppError( 'cart not found', 404))
    }
    return res.json({ msg: 'done', cart })
})

