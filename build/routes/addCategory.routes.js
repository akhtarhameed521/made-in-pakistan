"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addCategory_controllers_1 = require("../controllers/addCategory.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/addCategory').post(addCategory_controllers_1.addCategoryController);
router.route('/addCategory').get(addCategory_controllers_1.getAddCategoryController);
router.route('/addCategory/:id').put(addCategory_controllers_1.updateAddCategoryController);
router.route('/addCategory/:id').delete(addCategory_controllers_1.deleteAddCategoryController);
exports.default = router;
