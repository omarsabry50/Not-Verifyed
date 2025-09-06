import { Router } from "express";
import { multerHost } from "../../glopalMiddelWares/multer.js";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { createProudctSchema, updateProudctSchema } from "./productSchemas.js";
import { createProduct, deleteProudct, getAllProducts, getProudcts, updateProduct } from "./product.controler.js";
import reviewRouter from "../review/review.routes.js";


let productRouter = Router({mergeParams:true})

productRouter.use('/:productId/review',reviewRouter)

productRouter.post('/',auth(["admin"]),multerHost().fields([{name:'image' , maxCount:1  },{ name:"images",maxCount: 4}]),GValidator(createProudctSchema),createProduct)
productRouter.delete('/:ProductID',auth(["admin"]),deleteProudct)
productRouter.put('/:ProductID',auth(["admin"]),multerHost().fields([{name:'image' , maxCount:1  },{ name:"images",maxCount: 4}]),GValidator(updateProudctSchema),updateProduct)
productRouter.get('/',getProudcts)
productRouter.get('/getAllProducts',getAllProducts)


export default productRouter