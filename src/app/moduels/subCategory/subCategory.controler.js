import slugify from "slugify";
import { categoryModel } from "../../../db/models/category.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from "nanoid";
import AppError from "../../utils/AppError.js";
import { subCategoryModel } from "../../../db/models/subCategory.model.js";


export const createSubCategory = asyncHandler(async (req, res, next) => {
    const { name  } = req.body
    const { categoryId } = req.params

    let category = await categoryModel.findById(categoryId)
    if (!category) {
        next(new AppError('Category not found', 404))
    }

    let customId = nanoid(5)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `commerce/categories/${category.customId}/subCategory/${customId}`
    })

    req.folder = `commerce/categories/${category.customId}/subCategory/${customId}`


    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name,{replacement:'-',lower : true}),
        image: { secure_url, public_id },
        createdBy: req.user._id ,
        customId ,
        category : categoryId
    })

    req.data = {model : subCategoryModel , id :subCategory._id  }

    res.status(201).json({ msg: 'category created', subCategory })
})

export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    let {categoryId , subCategoryID} = req.params

    let category = await categoryModel.findOne({_id:categoryId})
    let subCategory = await subCategoryModel.findOne({_id:subCategoryID, category : categoryId , createdBy: req.user._id})


    if(!category){
        next(new AppError( 'Category not found ', 404))
    }
    if(!subCategory){
        next(new AppError( 'subCategory not found ', 404))
    }
    

    if(name){
        let nameExist = await subCategoryModel.findOne({ name: name.toLowerCase() , category : categoryId})

        if(nameExist){
            next(new AppError( 'Category name already exists', 400))
        }

        subCategory.name = name
        subCategory.slug = slugify(name,{replacement:'-',lower : true})
    }

    if(req.file){
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `commerce/categories/${category.customId}/subCategoris/${subCategory.customId}`
        })
        category.image.secure_url = secure_url
        category.image.public_id = public_id
    }

    await subCategory.save()

    return res.json({ msg: 'subCategory updated', subCategory })
})

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
    let {categoryId, subCategoryID} = req.params
    let category = await categoryModel.findById(categoryId)
    if(!category){
        next(new AppError( 'Category not found ', 404))
    }

    let subCategory = await subCategoryModel.findOneAndDelete({_id:subCategoryID, category : categoryId , createdBy: req.user._id})

    
    
    if(!subCategory){
        next(new AppError( 'subCategory not found ', 404))
    }
    
    await cloudinary.api.delete_resources_by_prefix(`commerce/categories/${category.customId}/subCategory/${subCategory.customId}`)
    await cloudinary.api.delete_folder(`commerce/categories/${category.customId}/subCategory/${subCategory.customId}`)

    return res.json({ msg: 'subCategory deleted' , subCategory})
})

export const getCategorySubCategories = asyncHandler(async (req, res, next) => {
    
    let {categoryId} = req.params
    let category = await categoryModel.findById(categoryId)
    if(!category){
        next(new AppError( 'Category not found ', 404))
    }
    
    let subCategories = await subCategoryModel.find({ category : categoryId }).populate("createdBy")
    
    if(!subCategories){
        return res.json({ msg: 'No subcategories found' })
    }

    return res.json({ msg: 'Subcategories fetched', subCategories })
})