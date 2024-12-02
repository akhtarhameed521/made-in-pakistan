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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouponController = exports.updateCouponController = exports.getCouponByIdController = exports.getAllCouponsController = exports.couponController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const coupans_models_1 = require("../models/coupans.models");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const couponController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponCode, type, value, status } = req.body;
        const payload = yield coupans_models_1.Coupan.create({ couponCode, type, value, status });
        if (!payload)
            throw new ApiError_1.ApiError(400, "Failed to create coupon");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "Coupon code added successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.couponController = couponController;
const getAllCouponsController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield coupans_models_1.Coupan.find();
        if (!coupons.length)
            throw new ApiError_1.ApiError(404, "No coupons found");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, coupons, "Coupons retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getAllCouponsController = getAllCouponsController;
const getCouponByIdController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield coupans_models_1.Coupan.find();
        if (!coupon)
            throw new ApiError_1.ApiError(404, "Coupon not found");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, "Coupon retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getCouponByIdController = getCouponByIdController;
// Update Coupon Controller
const updateCouponController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const coupon = yield coupans_models_1.Coupan.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!coupon)
            throw new ApiError_1.ApiError(404, "Coupon not found");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, "Coupon updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateCouponController = updateCouponController;
// Delete Coupon Controller
const deleteCouponController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const coupon = yield coupans_models_1.Coupan.findByIdAndDelete(id);
        if (!coupon)
            throw new ApiError_1.ApiError(404, "Coupon not found");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, "Coupon deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteCouponController = deleteCouponController;
