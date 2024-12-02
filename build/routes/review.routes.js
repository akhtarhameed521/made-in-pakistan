"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_controllers_1 = require("../controllers/review.controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/review').post(review_controllers_1.reviewController);
router.route('/review').get(review_controllers_1.getReviewController);
router.route('/review/:id').get(review_controllers_1.getReviewByUser);
router.route('/review/:id').put(review_controllers_1.updateReviewController);
router.route('/review/:id').delete(review_controllers_1.deleteReviewController);
exports.default = router;
