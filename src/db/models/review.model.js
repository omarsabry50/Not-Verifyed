import mongoose, { Types } from "mongoose";

let reviewSchema = mongoose.Schema({
    
    comment:{
        type: String,
        required: true,
        maxLength: 500
     },
    rate:{
        type: Number,
        required: true,
        min: 0,
        max: 5
     },
    user:{
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    productId:{
        type: Types.ObjectId,
        ref: 'product',
        required: true
    },
    

    
})



export const reviewModel= mongoose.model('review', reviewSchema);