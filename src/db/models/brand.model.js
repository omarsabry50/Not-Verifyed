import mongoose, { Types } from "mongoose";

let brandSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15,
        lowercase:true,
        trim:true,
        unique: true
    }
    ,
    slug:{
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 15,
        trim:true,
    }
    ,
    createdBy:{
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
    ,
    image:{
        secure_url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    }
    ,
    customId : {
        type: String,
        required: true,
        unique: true    
    }
    
})

export const brandModel= mongoose.model('brand', brandSchema);