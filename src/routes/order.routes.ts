import { verifyJWT } from "../middleware/auth.middleware"
import { deleteOrderController, getOrderByUser, getOrderController, orderController, updateOrderController } from "../controllers/order.controllers"
import express from "express"

const router = express.Router()

router.route("/order").post( verifyJWT, orderController)
router.route("/order/:id").patch(updateOrderController)
router.route("/order/:id").delete(deleteOrderController)
router.route("/order/:userId").get(getOrderByUser)
router.route("/order").get(getOrderController)


export default router