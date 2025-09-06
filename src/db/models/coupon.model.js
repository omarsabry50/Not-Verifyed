import mongoose, { Types } from "mongoose";

let couponSchema = mongoose.Schema({
    code:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        lowercase:true,
        trim:true,
        unique: true
    }
    ,
    createdBy:{
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    amount:{
        type: Number,
        required: true,
        min: 1,
        max:100
    }
    ,
    usedBy:[{
        type: Types.ObjectId,
        ref: 'user',
    }]
    ,
    fromDate:{
        type: Date,
        required: true,
    }
    ,
    toDate:{
        type: Date,
        required: true,
    }

    
})

export const couponModel= mongoose.model('coupon', couponSchema);