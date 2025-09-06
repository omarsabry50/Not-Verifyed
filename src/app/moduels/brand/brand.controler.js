import slugify from "slugify";
import asyncHandler from "../../utils/asyncHandler.js";
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from "nanoid";
import AppError from "../../utils/AppError.js";
import { brandModel } from "../../../db/models/brand.model.js";


export const getBrands = asyncHandler(async (req, res, next) => {
    const brands = await brandModel.find().select({name :1 , slug :1, image :1 , _id :0 })
    res.json({ msg: 'brands fetched', brands })
})

export const deletebrand = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    const brand = await brandModel.findOneAndDelete({_id:id , createdBy:req.user._id})

    if (!brand) {
        next(new AppError('brand not found', 404))
    }

    await cloudinary.api.delete_resources_by_prefix(`commerce/brands/${brand.customId}`)
    await cloudinary.api.delete_folder(`commerce/brands/${brand.customId}`)

    res.json({ msg: 'done', brand })
})

export const getBrand = asyncHandler(async (req, res, next) => {
    let {id} = req.params
    const brand = await brandModel.findById(id).select({name :1 , slug :1, image :1 , _id :0 })
    res.json({ msg: 'done', brand })
})

export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body

    if(await brandModel.findOne({ name})){
        next(new AppError( 'brand name already exists', 400))
    }

    let customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `commerce/brands/${customId}`
    })

    req.folder = `commerce/brands/${customId}`
    

    const brand = await brandModel.create({
        name,
        slug: slugify(name,{replacement:'-',lower : true}),
        image: { secure_url, public_id },
        createdBy: req.user._id ,
        customId
    })

    req.data = {model : brandModel , id : brand._id}


    res.status(201).json({ msg: 'brand created', brand })
})

export const updateBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    let {id} = req.params
    let brand = await brandModel.findOne({_id:id , createdBy : req.user._id})

    if(!brand){
        next(new AppError( 'brand not found ', 404))
    }
    

    if(name){
        let nameExist = await brandModel.findOne({ name: name.toLowerCase()})

        if(nameExist){
            next(new AppError( 'brand name already exists', 400))
        }

        brand.name = name
        brand.slug = slugify(name,{replacement:'-',lower : true})
    }

    if(req.file){
        await cloudinary.uploader.destroy(brand.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `commerce/brands/${brand.customId}`
        })
        brand.image.secure_url = secure_url
        brand.image.public_id = public_id
    }


    await brand.save()

    return res.json({ msg: 'brand updated', brand })
})