import { reviewController, deleteReviewController, getReviewController, updateReviewController, getReviewByUser } from "../controllers/review.controllers"
import express from "express"
const router = express.Router()

router.route('/review').post(reviewController)
router.route('/review').get(getReviewController)
router.route('/review/:id').get(getReviewByUser)
router.route('/review/:id').put(updateReviewController)
router.route('/review/:id').delete(deleteReviewController)

export default router