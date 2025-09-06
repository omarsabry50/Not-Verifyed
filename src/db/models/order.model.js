import mongoose, { Types } from "mongoose";

let orderSchema = mongoose.Schema({
    user:{
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    products:[{
        title:{
            type: String,
            required: true
        },
        productId:{
            type: Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            min: 1
        },
        price:{
            type: Number,
            required: true
        },
        finalPrice:{
            type: Number,
            required: true
        }
    }]
    ,
    subPrice:{
        type: Number,
        required: true
    }
    ,
    couponId:{
        type: Types.ObjectId,
        ref: 'coupon',
        required: false
    }
    ,
    discount:{
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
    ,
    totalPrice:{
        type: Number,
        required: true
    }
    ,
    address:{
        type: String,
        required: true
    }
    ,
    phone:{
        type: String,
        required: true
    }
    ,
    paymentMethod:{
        type: String,
        required: true,
        enum: ["cash", "card"]
    }
    ,
    status:{
        type: String,
        required: true,
        enum: ["placed", "waitPayment", "onWay", "delivered", "canceled" , "rejected"],
        default: "placed"
    }
    ,
    canceldBy:{
        type: Types.ObjectId,
        ref: 'user',
    }
    ,
    reason:{
        type: String,
    }


    
})


export const orderModel= mongoose.model('order', orderSchema);