import mongoose, { Types } from "mongoose";

let categorySchema = mongoose.Schema({
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
        required: false
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
    
},{
    // toObject: { virtuals: true },
    toJSON: { virtuals: true }  // to include virtual fields in the JSON output
})

// Virtual field to get the number of products in the category

categorySchema.virtual('subCategories', {
    ref: 'subCategory',
    localField: '_id',
    foreignField: 'category',
});

export const categoryModel= mongoose.model('category', categorySchema);