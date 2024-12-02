import { checkoutController, getCheckoutByUser, getCheckoutController } from "../controllers/checkout.controllers"
import express from "express"
const router = express.Router()

router.route("/checkout").post(checkoutController)
router.route("/checkout").get(getCheckoutController)
router.route("/checkout/:id").get(getCheckoutByUser)

export default router