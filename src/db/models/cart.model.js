import mongoose, { Types } from "mongoose";

let cartSchema = mongoose.Schema({
    
    
    user:{
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    products:[{
        productId:{
            type: Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        }
    }]
    
})


export const cartModel= mongoose.model('cart', cartSchema);