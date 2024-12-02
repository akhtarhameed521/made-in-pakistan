"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const banners_controllers_1 = require("../controllers/banners.controllers");
const router = express_1.default.Router();
router.route('/banner').post(upload_middleware_1.upload.single('bannerImage'), banners_controllers_1.bannerControllers);
router.route('/banner/:id').put(upload_middleware_1.upload.single('bannerImage'), banners_controllers_1.updateBannerControllers);
router.route('/banner/:id').delete(banners_controllers_1.deleteBannerController);
router.route('/banner').get(banners_controllers_1.getBannerController);
exports.default = router;
