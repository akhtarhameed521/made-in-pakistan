"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shipping_controllers_1 = require("../controllers/shipping.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/shipping').post(shipping_controllers_1.shippingController);
router.route('/shipping').get(shipping_controllers_1.getShippingController);
router.route('/shipping/:id').put(shipping_controllers_1.updateShippingController);
router.route('/shipping/:id').delete(shipping_controllers_1.deleteShippingController);
exports.default = router;
