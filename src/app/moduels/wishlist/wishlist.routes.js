import { Router } from "express";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import {  createWishList, getWishList, removeFromwishList, toCart } from './wishlist.controler.js'
import { createWhisListSchema } from "./wishlistSchemas.js";


let wishListRouter = Router()


wishListRouter.post('/',auth(["admin" , "user"]),GValidator(createWhisListSchema),createWishList)
wishListRouter.get('/',auth(["user" , "admin"]),getWishList)
wishListRouter.put('/:productId',auth(["admin" , "user"]),removeFromwishList)
wishListRouter.patch('/:productId',auth(["admin" , "user"]),toCart)


export default wishListRouter