import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./category.controler.js";
import { multerHost } from "../../glopalMiddelWares/multer.js";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { createCategorySchema, updateCategorySchema } from "./categorySchemas.js";
import subcategoryRouter from "../subCategory/subCategory.routes.js";


let categoryRouter = Router()
categoryRouter.use('/:categoryId/subCategory',subcategoryRouter)


categoryRouter.get('/',getCategories)
categoryRouter.get('/:id',getCategory)
categoryRouter.delete('/:id',deleteCategory)
// categoryRouter.post('/createCategory',auth(["admin"]),multerHost().single("photo"),GValidator(createCategorySchema),createCategory)
categoryRouter.post('/createCategory', multerHost().single("photo"), GValidator(createCategorySchema), createCategory)

categoryRouter.put('/updateCategory/:id',auth(["admin"]),multerHost().single("photo"),GValidator(updateCategorySchema),updateCategory)

export default categoryRouter