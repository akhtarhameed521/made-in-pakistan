import express from "express"
import { upload } from "../middleware/upload.middleware"
import { addToWishListController, deleteAddToWishList, getAddToWishListByUser, getAddToWishListController } from "../controllers/addToWishlist.controllers"

const router = express.Router()

router.route("/addToWishList").post(upload.single("productImage"), addToWishListController)
router.route("/addToWishList").get(getAddToWishListController)
router.route("/addToWishList/:id").get(getAddToWishListByUser)
router.route("/addToWishList/:id").delete(deleteAddToWishList)

export default router