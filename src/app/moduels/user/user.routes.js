import { Router } from "express";
import { deleteUser, forgetPassword, login, resetPassword, reVerfiyng, signUp, ubdatePassword, updateUser, verfiyng } from "./user.controler.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { signUpSchema , resetPasswordSchema, loginSchema, updateUserSchema, updatePasswordSchema, deleteSchema } from "./userSchemas.js";
import auth from "../../glopalMiddelWares/auth.js";

let userRouter = Router()
let all = ["user","admin"]

userRouter.post('/',GValidator(signUpSchema), signUp);
userRouter.get('/verfiy/:token',verfiyng );
userRouter.get('/reVerfiy/:reToken',reVerfiyng );
userRouter.post('/forgetPassword' ,forgetPassword );
userRouter.post('/resetPassword',GValidator(resetPasswordSchema),resetPassword );
userRouter.post('/logIn',GValidator(loginSchema), login);
userRouter.put('/updateUser',GValidator(updateUserSchema),auth(all), updateUser);
userRouter.patch('/updatePassword',GValidator(updatePasswordSchema),auth(all), ubdatePassword);
userRouter.delete('/deleteUser',GValidator(deleteSchema),auth(all), deleteUser);


export default userRouter