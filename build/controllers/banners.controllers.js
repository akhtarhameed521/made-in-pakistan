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
exports.getBannerController = exports.deleteBannerController = exports.updateBannerControllers = exports.bannerControllers = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const banners_models_1 = require("../models/banners.models");
const ApiError_1 = require("../utils/ApiError");
const cloudinary_1 = require("../utils/cloudinary");
const ApiResponse_1 = require("../utils/ApiResponse");
const bannerControllers = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status } = req.body;
        const avatarLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!avatarLocalPath) {
            throw new ApiError_1.ApiError(400, "Banner image is required");
        }
        const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
        const payload = yield banners_models_1.Banner.create({
            title,
            description,
            bannerImage: avatar === null || avatar === void 0 ? void 0 : avatar.url,
            status,
        });
        if (!payload)
            throw new ApiError_1.ApiError(400, "There is no data found in banner");
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Banner added successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.bannerControllers = bannerControllers;
const updateBannerControllers = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let imageUrl = req.body.logo;
        if (req.file) {
            const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
            imageUrl = avatar === null || avatar === void 0 ? void 0 : avatar.url;
        }
        const payload = yield banners_models_1.Banner.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { bannerImage: imageUrl }), { new: true });
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
exports.updateBannerControllers = updateBannerControllers;
const deleteBannerController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield banners_models_1.Banner.findByIdAndDelete(id);
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
exports.deleteBannerController = deleteBannerController;
const getBannerController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield banners_models_1.Banner.find();
        if (!payload.length) {
            throw new ApiError_1.ApiError(400, "No data found in banner controller");
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getBannerController = getBannerController;
