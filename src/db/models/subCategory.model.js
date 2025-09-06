import mongoose, { Types } from "mongoose";

let subCategorySchema = mongoose.Schema({
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
    ,
    category:{
        type: Types.ObjectId,
        ref: 'category',
        required: true
    }
    
})

export const subCategoryModel= mongoose.model('subCategory', subCategorySchema);