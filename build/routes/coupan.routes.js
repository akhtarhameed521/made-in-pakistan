"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coupan_controllers_1 = require("../controllers/coupan.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/coupon').post(coupan_controllers_1.couponController);
router.route('/coupon').get(coupan_controllers_1.getCouponByIdController);
router.route('/coupon/:id').put(coupan_controllers_1.updateCouponController);
router.route('/coupon/:id').delete(coupan_controllers_1.deleteCouponController);
exports.default = router;
