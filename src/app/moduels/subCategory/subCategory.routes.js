import { Router } from "express";
import {  createSubCategory, deleteSubCategory, getCategorySubCategories, updateSubCategory } from "./subCategory.controler.js";
import { multerHost } from "../../glopalMiddelWares/multer.js";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { createSubCategorySchema, updateSubCategorySchema } from "./subCategorySchemas.js";
import productRouter from "../product/product.routes.js";


let subcategoryRouter = Router({mergeParams:true})

subcategoryRouter.use('/:subCategoryId/product',productRouter)


subcategoryRouter.post('/',auth(["admin"]),multerHost().single("photo"),GValidator(createSubCategorySchema),createSubCategory)
subcategoryRouter.delete('/:subCategoryID',auth(["admin"]),deleteSubCategory)
subcategoryRouter.put('/updatesubCategory/:id',auth(["admin"]),multerHost().single("photo"),GValidator(updateSubCategorySchema),updateSubCategory)
subcategoryRouter.get('/getCategorySubCategories',auth(["admin","user"]),getCategorySubCategories)

export default subcategoryRouter