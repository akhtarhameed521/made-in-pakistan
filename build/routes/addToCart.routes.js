"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const addToCart_controllers_1 = require("../controllers/addToCart.controllers");
const router = express_1.default.Router();
router.route("/addToCart").post(upload_middleware_1.upload.single("productImage"), addToCart_controllers_1.addToCartController);
router.route("/addToCart").get(addToCart_controllers_1.getAddToCartController);
router.route("/addToCart/:id").get(addToCart_controllers_1.getAddToCartByUser);
router.route('/addToCart/:id').patch(addToCart_controllers_1.updateAddToCart);
router.route("/addToCart/:id").delete(addToCart_controllers_1.deleteAddToCart);
exports.default = router;
