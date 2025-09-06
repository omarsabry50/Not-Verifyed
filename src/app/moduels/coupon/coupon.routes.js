import { Router } from "express";
import { multerHost } from "../../glopalMiddelWares/multer.js";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { createCouponSchema, updateCopounSchema } from "./couponSchemas.js";
import { createCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon } from "./coupon.controler.js";


let couponRouter = Router()


couponRouter.post('/',auth(["admin"]),GValidator(createCouponSchema),createCoupon)
couponRouter.put('/:id',auth(["admin"]),GValidator(updateCopounSchema),updateCoupon)
couponRouter.get('/',auth(["admin"]),getCoupons)
couponRouter.get('/:id',getCoupon)
couponRouter.delete('/:id',auth(["admin"]),deleteCoupon)

export default couponRouter