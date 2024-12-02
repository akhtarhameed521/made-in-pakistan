"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tag_controller_1 = require("../controllers/tag.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/tag').post(tag_controller_1.tagController);
router.route('/tag').get(tag_controller_1.getTagController);
router.route('/tag/:id').put(tag_controller_1.updateTagController);
router.route('/tag/:id').delete(tag_controller_1.deleteTagController);
exports.default = router;
