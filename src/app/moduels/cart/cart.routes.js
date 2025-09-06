import { Router } from "express";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import {clearCart, createCart, getCart, removeFromCart} from './cart.controler.js'
import { createCartSchema } from "./cartSchemas.js";


let cartRouter = Router()


cartRouter.post('/',auth(["admin" , "user"]),GValidator(createCartSchema),createCart)
cartRouter.put('/:productId',auth(["admin" , "user"]),removeFromCart)
cartRouter.get('/',auth(["user" , "admin"]),getCart)
cartRouter.delete('/',auth(["admin" , "user"]),clearCart)

export default cartRouter