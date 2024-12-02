"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brand_controllers_1 = require("../controllers/brand.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/brand').post(brand_controllers_1.brandController);
router.route('/brand').get(brand_controllers_1.getBrandController);
router.route('/brand/:id').put(brand_controllers_1.updateBrandController);
router.route('/brand/:id').delete(brand_controllers_1.deleteBrandController);
exports.default = router;
