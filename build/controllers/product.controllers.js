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
exports.deleteController = exports.getController = exports.updateController = exports.postController = void 0;
const product_models_1 = require("../models/product.models"); // Adjust the path as necessary
const cloudinary_1 = require("../utils/cloudinary"); // Adjust the path as necessary
const asyncHandler_1 = require("../utils/asyncHandler"); // Adjust the path as necessary
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const postController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customReq = req;
        const { title, summary, description, isFeature, category, price, discount, size, brand, condition, quantity, status, } = customReq.body;
        let photoUrl = "";
        let videoUrl = "";
        let additionalImages = [];
        if (customReq.files) {
            if (customReq.files.photo && customReq.files.photo[0]) {
                const photoResponse = yield (0, cloudinary_1.uploadOnCloudinary)(customReq.files.photo[0].path);
                photoUrl = photoResponse === null || photoResponse === void 0 ? void 0 : photoResponse.secure_url;
            }
            if (customReq.files.addMoreImages) {
                for (const file of customReq.files.addMoreImages) {
                    const imageResponse = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
                    additionalImages.push(imageResponse === null || imageResponse === void 0 ? void 0 : imageResponse.secure_url);
                }
            }
            if (customReq.files.video && customReq.files.video[0]) {
                const videoResponse = yield (0, cloudinary_1.uploadOnCloudinary)(customReq.files.video[0].path);
                videoUrl = videoResponse === null || videoResponse === void 0 ? void 0 : videoResponse.secure_url;
            }
        }
        const payload = yield product_models_1.Product.create({
            title,
            summary,
            description,
            isFeature,
            category,
            price,
            discount,
            size,
            brand,
            condition,
            quantity,
            photo: photoUrl,
            addMoreImages: additionalImages,
            video: videoUrl,
            status,
        });
        if (!payload)
            throw new ApiError_1.ApiError(400, "no data found");
        res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(200, payload, "data added successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.postController = postController;
const updateController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customReq = req;
        const { id } = req.params;
        const { title, summary, description, isFeature, category, price, discount, size, brand, condition, quantity, status, } = customReq.body;
        let photoUrl = "";
        let videoUrl = "";
        let additionalImages = [];
        if (customReq.files) {
            if (customReq.files.photo && customReq.files.photo[0]) {
                const photoResponse = yield (0, cloudinary_1.uploadOnCloudinary)(customReq.files.photo[0].path);
                photoUrl = photoResponse === null || photoResponse === void 0 ? void 0 : photoResponse.secure_url;
            }
            if (customReq.files.addMoreImages) {
                for (const file of customReq.files.addMoreImages) {
                    const imageResponse = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
                    additionalImages.push(imageResponse === null || imageResponse === void 0 ? void 0 : imageResponse.secure_url);
                }
            }
            if (customReq.files.video && customReq.files.video[0]) {
                const videoResponse = yield (0, cloudinary_1.uploadOnCloudinary)(customReq.files.video[0].path);
                videoUrl = videoResponse === null || videoResponse === void 0 ? void 0 : videoResponse.secure_url;
            }
        }
        const updatedProduct = yield product_models_1.Product.findByIdAndUpdate(id, {
            title,
            summary,
            description,
            isFeature,
            category,
            price,
            discount,
            size,
            brand,
            condition,
            quantity,
            photo: photoUrl,
            addMoreImages: additionalImages,
            video: videoUrl,
            status,
        }, { new: true });
        if (!updatedProduct)
            throw new ApiError_1.ApiError(400, "failed to update the product");
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, updatedProduct, "product updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateController = updateController;
const getController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category, sort, priceOrder } = req.query;
        const queryObject = {};
        if (title) {
            queryObject.title = { $regex: new RegExp(title, 'i') };
        }
        if (category) {
            queryObject.category = category;
        }
        let sortOption = {};
        if (sort) {
            sortOption.title = sort === 'asc' ? 1 : -1;
        }
        if (priceOrder) {
            sortOption.price = priceOrder === 'asc' ? 1 : -1;
        }
        const products = yield product_models_1.Product.find(queryObject).sort(sortOption);
        if (!products.length) {
            throw new ApiError_1.ApiError(400, "Failed to get product");
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, products, "Data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getController = getController;
const deleteController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_models_1.Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteController = deleteController;
