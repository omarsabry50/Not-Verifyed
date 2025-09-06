import slugify from "slugify";
import asyncHandler from "../../utils/asyncHandler.js";
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from "nanoid";
import AppError from "../../utils/AppError.js";
import { subCategoryModel } from "../../../db/models/subCategory.model.js";
import { categoryModel } from "../../../db/models/category.model.js";
import { brandModel } from "../../../db/models/brand.model.js";
import apiFeatures from "../../utils/apiFeatures.js";
import { productModel } from "../../../db/models/product.model.js";


export const createProduct = asyncHandler(async (req, res, next) => {
    const { title , stock , descreption , brand , price , discount } = req.body
    const { categoryId , subCategoryId } = req.params
    
    let theBrand = await brandModel.findById(brand)
    if (!theBrand) {
        next(new AppError('brand not found', 404))
    }

    let category = await categoryModel.findById(categoryId)
    if (!category) {
        next(new AppError('Category not found', 404))
    }
    let subCategory = await subCategoryModel.findOne({ _id : subCategoryId , category : categoryId})
    if (!subCategory) {
        next(new AppError('subCategory not found', 404))
    }


    let customId = nanoid(5)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${customId}`
    })

    req.folder = `commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${customId}`
    

    let images = []
    for(let image of req.files.images){
        const { secure_url, public_id } = await cloudinary.uploader.upload(image.path, {
            folder: `commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${customId}/coverImages`
        })
        images.push({secure_url, public_id})

    }




    let product = await productModel.create({
        title,
        slug : slugify(title,{replacement:'-',lower : true}),
        stock ,
        descreption ,
        price ,
        subPrice: price - (discount/100*price) ,
        discount ,
        subCategory : subCategoryId ,
        createdBy: req.user._id ,
        customId,
        brand,
        category : categoryId,
        image : { secure_url, public_id },
        coverImages : images 
    })

    req.data = {model : productModel , id : product._id}

    return res.status(201).json({ msg: 'product created' , product })
})

export const updateProduct = asyncHandler(async (req, res, next) => {
    const { title , stock , descreption , price , discount } = req.body
    const { categoryId , subCategoryId , ProductID } = req.params

    let category = await categoryModel.findOne({_id:categoryId})

    if(!category){
        next(new AppError( 'Category not found ', 404))
    }

    let subCategory = await subCategoryModel.findOne({_id:subCategoryId , category:categoryId})

    if(!subCategory){
        next(new AppError( 'Category not found ', 404))
    }

    let product = await productModel.findOne({_id:ProductID, category : categoryId , subCategory : subCategoryId })

    if(!product){
        next(new AppError( 'Product not found ', 404))
    }
    

    if(title){
        let titleExist = await productModel.findOne({ title: title.toLowerCase() , category : categoryId , subCategory : subCategoryId })

        if(titleExist){
            next(new AppError( 'product title already exists', 400))
        }

        product.title = title.toLowerCase()
        product.slug = slugify(title,{replacement:'-',lower : true})
    }

    if(req?.files){
        if(req.files?.image?.[0]){
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                 folder: `commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${product.customId}`
            })

            req.folder = `commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${product.customId}`
            product.image.secure_url = secure_url
            product.image.public_id = public_id
        }

        if(req.files.images){
            await cloudinary.api.delete_resources_by_prefix(`commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${product.customId}/coverImages`)
            await cloudinary.api.delete_folder(`commerce/categories/${category.customId}/subcategory/${subCategory.customId}/Product/${product.customId}/coverImages`)
            let images = []

            for(let image of req.files.images){
            const { secure_url, public_id } = await cloudinary.uploader.upload(image.path, {
                folder: `commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${product.customId}/coverImages`
            })
            images.push({secure_url, public_id})
            }
            product.coverImages = images
        }
        
    }


    if(stock){
        product.stock = stock
    }

    if(descreption){
        product.descreption = descreption
    }

    if(price || discount){
        product.price = price || product.price
        product.discount = discount || product.discount
        product.subPrice = product.price - (product.discount/100*product.price)
    }


    await product.save()

    return res.json({ msg: 'Product updated', product })
})


export const getProudcts = asyncHandler(async (req,res,next)=>{
    let {categoryId , subCategoryId} = req.params
    let category = await categoryModel.findById(categoryId)
    if(!category){
        next(new AppError( 'Category not found ', 404))
    }
    
    let subCategory = await subCategoryModel.findOne({_id:subCategoryId , category : categoryId})

    if(!subCategory){
        next(new AppError( 'SubCategory not found ', 404))
    }

    let products = await productModel.find({ category : categoryId , subCategory : subCategoryId})
    
    return res.json({ msg: 'Products fetched', products })
})


export const getAllProducts = asyncHandler(async (req,res,next)=>{

    let api = new apiFeatures(productModel.find() , req.query)
    .pagination()
    .filter()
    .sort()
    .select()

    
    

    
    const products = await api.mongooseQuery
    

    if(products?.length == 0){
       return next(new AppError( 'no products ', 404))
    }
    
    return res.json({ msg: 'Products fetched', products })
})



export const deleteProudct = asyncHandler(async (req, res, next) => {
    let {categoryId,subCategoryId , ProductID} = req.params

    let category = await categoryModel.findById(categoryId)
    if(!category){
        next(new AppError( 'Category not found ', 404))
    }

    let subCategory = await subCategoryModel.findOne({_id:subCategoryId , category : categoryId})
    if(!subCategory){
        next(new AppError( 'SubCategory not found ', 404))
    }

    let Product = await productModel.findOneAndDelete({_id:ProductID, category : categoryId , subCategory : subCategoryId})
    
    if(!Product){
        next(new AppError( 'Product not found ', 404))
    }
    
    await cloudinary.api.delete_resources_by_prefix(`commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${Product.customId}`)
    await cloudinary.api.delete_folder(`commerce/categories/${category.customId}/subCategory/${subCategory.customId}/Product/${Product.customId}`)

    return res.json({ msg: 'Product deleted' , Product})
})

