"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewByUser = exports.deleteReviewController = exports.updateReviewController = exports.getReviewController = exports.reviewController = void 0;
const ApiError_1 = require("../utils/ApiError");
const review_models_1 = require("../models/review.models");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const user_models_1 = require("../models/user.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reviewController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield user_models_1.User.findById(decoded._id).select('-password -refreshToken');
        const { reviewBy, productTitle, review, rate, status } = req.body;
        const payload = yield review_models_1.Review.create({ reviewBy: user === null || user === void 0 ? void 0 : user.name, userId: user === null || user === void 0 ? void 0 : user._id, productTitle, review, rate, status });
        yield payload.save();
        if (!payload)
            throw new ApiError_1.ApiError(400, "no data created at Review");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "Review created successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.reviewController = reviewController;
const getReviewController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield review_models_1.Review.find();
        if (!payload.length)
            throw new ApiError_1.ApiError(400, "no data found in Review");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getReviewController = getReviewController;
const getReviewByUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const payload = yield review_models_1.Review.find({ userId: userId });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfull"));
}));
exports.getReviewByUser = getReviewByUser;
const updateReviewController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield review_models_1.Review.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!payload)
            throw new ApiError_1.ApiError(400, "update failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateReviewController = updateReviewController;
const deleteReviewController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield review_models_1.Review.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, "delete failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteReviewController = deleteReviewController;
