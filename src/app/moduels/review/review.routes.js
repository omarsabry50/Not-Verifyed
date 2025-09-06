import { Router } from "express";
import auth from "../../glopalMiddelWares/auth.js";
import GValidator from "../../glopalMiddelWares/GValidator.js";
import { createReviewSchema, } from "./reviewSchemas.js";
import { createReview, deleteReview, getReviews} from "./review.controler.js";


let reviewRouter = Router({mergeParams:true})


reviewRouter.post('/',auth(["admin" , "user"]),GValidator(createReviewSchema),createReview)
reviewRouter.get('/',auth(["admin" , "user"]),getReviews)
reviewRouter.delete('/',auth(["admin" , "user"]),deleteReview)


export default reviewRouter