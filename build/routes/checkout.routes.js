"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_controllers_1 = require("../controllers/checkout.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route("/checkout").post(checkout_controllers_1.checkoutController);
router.route("/checkout").get(checkout_controllers_1.getCheckoutController);
router.route("/checkout/:id").get(checkout_controllers_1.getCheckoutByUser);
exports.default = router;
