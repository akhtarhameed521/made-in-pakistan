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
exports.deleteBrandController = exports.updateBrandController = exports.getBrandController = exports.brandController = void 0;
const ApiError_1 = require("../utils/ApiError");
const brand_models_1 = require("../models/brand.models");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const brandController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status } = req.body;
        const payload = yield brand_models_1.Brand.create({ title, status });
        yield payload.save();
        if (!payload)
            throw new ApiError_1.ApiError(400, "no data created at brand");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "brand created successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.brandController = brandController;
const getBrandController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const queryObject = {};
        if (title) {
            queryObject.title = { $regex: new RegExp(title, "i") };
        }
        const payload = yield brand_models_1.Brand.find(queryObject);
        if (!payload.length)
            throw new ApiError_1.ApiError(400, "no data found in brand");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getBrandController = getBrandController;
const updateBrandController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield brand_models_1.Brand.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!payload)
            throw new ApiError_1.ApiError(400, "update failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateBrandController = updateBrandController;
const deleteBrandController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield brand_models_1.Brand.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, "delete failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteBrandController = deleteBrandController;
