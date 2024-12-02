"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_controllers_1 = require("../controllers/order.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route("/order").post(auth_middleware_1.verifyJWT, order_controllers_1.orderController);
router.route("/order/:id").patch(order_controllers_1.updateOrderController);
router.route("/order/:id").delete(order_controllers_1.deleteOrderController);
router.route("/order/:userId").get(order_controllers_1.getOrderByUser);
router.route("/order").get(order_controllers_1.getOrderController);
exports.default = router;
