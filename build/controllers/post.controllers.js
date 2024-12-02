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
exports.deletePostController = exports.updatePostController = exports.getPostController = exports.postController = void 0;
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const ApiResponse_1 = require("../utils/ApiResponse");
const post_models_1 = require("../models/post.models");
const postController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, quote, summary, description, category, postImage, Post, tag, author, status } = req.body;
        const avatarLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!avatarLocalPath) {
            throw new ApiError_1.ApiError(400, " Post image is required");
        }
        const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
        const payload = yield post_models_1.Posts.create({ title, quote, summary, category, description, postImage: avatar === null || avatar === void 0 ? void 0 : avatar.url, Post, tag, author, status });
        if (!payload)
            throw new ApiError_1.ApiError(400, "There is no data found in banner");
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Post added successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.postController = postController;
const updatePostController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        let imageUrl = (_a = req.body) === null || _a === void 0 ? void 0 : _a.logo;
        if (req.file) {
            const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
            imageUrl = avatar === null || avatar === void 0 ? void 0 : avatar.url;
        }
        const payload = yield post_models_1.Posts.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { postImage: imageUrl }), { new: true });
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
exports.updatePostController = updatePostController;
const deletePostController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield post_models_1.Posts.findByIdAndDelete(id);
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
exports.deletePostController = deletePostController;
const getPostController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield post_models_1.Posts.find();
        if (!payload.length) {
            throw new ApiError_1.ApiError(400, "No data found in Post controller");
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, payload, "Data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getPostController = getPostController;
