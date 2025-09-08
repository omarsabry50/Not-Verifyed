import slugify from "slugify";
import { categoryModel } from "../../../db/models/category.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from "nanoid";
import AppError from "../../utils/AppError.js";
import { subCategoryModel } from "../../../db/models/subCategory.model.js";


export const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find().populate([{
        path: 'subCategories',
    }])
    res.json({ msg: 'categories fetched', categories })
})

export const deleteCategory = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    if (!category) {
        next(new AppError('Category not found', 404))
    }

    await subCategoryModel.deleteMany({category:category._id})
    await cloudinary.api.delete_resources_by_prefix(`commerce/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`commerce/categories/${category.customId}`)
    res.json({ msg: 'done', category })
})

export const getCategory = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    const category = await categoryModel.findById(id).populate([{
        path: 'subCategories',
    }])
    res.json({ msg: 'done', category })
})

export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new AppError('Category name is required', 400));
    }

    const existing = await categoryModel.findOne({ name });
    if (existing) {
        return next(new AppError('Category name already exists', 400));
    }

    // generate unique ID
    let customId = nanoid(5);

    // upload image
    let imageData = null;
    if (req.file && req.file.path) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `commerce/categories/${customId}`
        });
        imageData = { secure_url, public_id };
    }

    // create category without requiring req.user
    const category = await categoryModel.create({
        name,
        slug: slugify(name, { replacement: '-', lower: true }),
        image: imageData,
        createdBy: req.user ? req.user._id : null, // optional
        customId
    });

    res.status(201).json({ msg: 'category created', category });
});


export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    let {id} = req.params
    let category = await categoryModel.findOne({_id:id , createdBy : req.user._id})

    if(!category){
        next(new AppError( 'Category not found ', 404))
    }
    

    if(name){
        let nameExist = await categoryModel.findOne({ name: name.toLowerCase()})

        if(nameExist){
            next(new AppError( 'Category name already exists', 400))
        }

        category.name = name
        category.slug = slugify(name,{replacement:'-',lower : true})
    }

    if(req.file){
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `commerce/categories/${category.customId}`
        })
        category.image.secure_url = secure_url
        category.image.public_id = public_id
    }


    await category.save()

    return res.json({ msg: 'category updated', category })
})