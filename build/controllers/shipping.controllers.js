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
exports.deleteShippingController = exports.updateShippingController = exports.getShippingController = exports.shippingController = void 0;
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const shipping_models_1 = require("../models/shipping.models");
const shippingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, price, status } = req.body;
        const payload = yield shipping_models_1.Shipping.create({ type, price, status });
        yield payload.save();
        if (!payload)
            throw new ApiError_1.ApiError(400, "no data created at shipping");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "shipping created successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.shippingController = shippingController;
const getShippingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield shipping_models_1.Shipping.find();
        if (!payload.length)
            throw new ApiError_1.ApiError(400, "no data found in shipping");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getShippingController = getShippingController;
const updateShippingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield shipping_models_1.Shipping.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!payload)
            throw new ApiError_1.ApiError(400, "update failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateShippingController = updateShippingController;
const deleteShippingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield shipping_models_1.Shipping.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, "delete failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteShippingController = deleteShippingController;
