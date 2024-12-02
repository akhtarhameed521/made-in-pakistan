"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const addToWishlist_controllers_1 = require("../controllers/addToWishlist.controllers");
const router = express_1.default.Router();
router.route("/addToWishList").post(upload_middleware_1.upload.single("productImage"), addToWishlist_controllers_1.addToWishListController);
router.route("/addToWishList").get(addToWishlist_controllers_1.getAddToWishListController);
router.route("/addToWishList/:id").get(addToWishlist_controllers_1.getAddToWishListByUser);
router.route("/addToWishList/:id").delete(addToWishlist_controllers_1.deleteAddToWishList);
exports.default = router;
