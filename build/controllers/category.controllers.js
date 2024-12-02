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
exports.deleteCategoryController = exports.updateCategoryController = exports.getCategoryController = exports.categoryController = void 0;
const ApiError_1 = require("../utils/ApiError");
const category_models_1 = require("../models/category.models");
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const ApiResponse_1 = require("../utils/ApiResponse");
const categoryController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, summary, isParent, parentCategory, categoryImage, status } = req.body;
        const avatarLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!avatarLocalPath) {
            throw new ApiError_1.ApiError(400, " category image is required");
        }
        const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
        const payload = yield category_models_1.Category.create({
            title,
            summary,
            isParent,
            parentCategory,
            categoryImage: avatar === null || avatar === void 0 ? void 0 : avatar.url,
            status,
        });
        if (!payload)
            throw new ApiError_1.ApiError(400, "There is no data found in banner");
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "category added successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.categoryController = categoryController;
const updateCategoryController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let imageUrl = req.body.logo;
        if (req.file) {
            const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
            imageUrl = avatar === null || avatar === void 0 ? void 0 : avatar.url;
        }
        const payload = yield category_models_1.Category.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { categoryImage: imageUrl }), { new: true });
        if (!payload)
            throw new ApiError_1.ApiError(400, "Update failed");
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateCategoryController = updateCategoryController;
const deleteCategoryController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield category_models_1.Category.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, "Delete failed");
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteCategoryController = deleteCategoryController;
const getCategoryController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const queryObject = {};
        if (title) {
            queryObject.title = { $regex: new RegExp(title, 'i') };
        }
        console.log('Query Object:', queryObject);
        const payload = yield category_models_1.Category.find(queryObject);
        if (!payload.length) {
            throw new ApiError_1.ApiError(400, "No data found in category controller");
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getCategoryController = getCategoryController;
