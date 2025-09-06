import { Router } from "express";
import { createBrand, deletebrand, getBrand, getBrands, updateBrand } from "./brand.controler.js";
import { multerHost } from "../../glopalMiddelWares/multer.js";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { createBrandSchema, updateBrandSchema } from "./BrandSchemas.js";


let brandRouter = Router()


brandRouter.post('/createBrand',auth(["admin"]),multerHost().single("photo"),GValidator(createBrandSchema),createBrand)
brandRouter.put('/updateBrand/:id',auth(["admin"]),multerHost().single("photo"),GValidator(updateBrandSchema),updateBrand)
brandRouter.get('/',getBrands)
brandRouter.get('/:id',getBrand)
brandRouter.delete('/:id',auth(["admin"]),deletebrand)

export default brandRouter