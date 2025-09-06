import mongoose, { Types } from "mongoose";

let wishListSchema = mongoose.Schema({
    
    
    user:{
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    products:[
        {
            type: Types.ObjectId,
            ref: 'product',
            required: true
        }
    ]
    
})


export const wishListModel= mongoose.model('wishList', wishListSchema);