import express from "express"
import { upload } from "../middleware/upload.middleware"
import { addToCartController, deleteAddToCart, getAddToCartByUser, getAddToCartController, updateAddToCart } from "../controllers/addToCart.controllers"

const router = express.Router()

router.route("/addToCart").post(upload.single("productImage"), addToCartController)
router.route("/addToCart").get(getAddToCartController)
router.route("/addToCart/:id").get(getAddToCartByUser)
router.route('/addToCart/:id').patch(updateAddToCart)
router.route("/addToCart/:id").delete(deleteAddToCart)

export default router