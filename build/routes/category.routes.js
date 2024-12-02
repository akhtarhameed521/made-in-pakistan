"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const category_controllers_1 = require("../controllers/category.controllers");
const router = express_1.default.Router();
router.route('/category').post(upload_middleware_1.upload.single('categoryImage'), category_controllers_1.categoryController);
router.route('/category').get(category_controllers_1.getCategoryController);
router.route('/category/:id').delete(category_controllers_1.deleteCategoryController);
router.route('/category/:id').put(upload_middleware_1.upload.single('categoryImage'), category_controllers_1.updateCategoryController);
exports.default = router;
