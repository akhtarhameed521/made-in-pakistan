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
exports.deleteAddToCart = exports.updateAddToCart = exports.getAddToCartByUser = exports.getAddToCartController = exports.addToCartController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const ApiError_1 = require("../utils/ApiError");
const addToCart_models_1 = require("../models/addToCart.models");
const ApiResponse_1 = require("../utils/ApiResponse");
const user_models_1 = require("../models/user.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addToCartController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productImage, productName, unitPrice, quantity, total, } = req.body;
    const localFileAvatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!localFileAvatar)
        throw new ApiError_1.ApiError(400, "no local file found");
    const productImageAvatar = yield (0, cloudinary_1.uploadOnCloudinary)(localFileAvatar);
    const token = req.cookies.accessToken;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = yield user_models_1.User.findById(decoded._id).select("-password -refreshToken");
    const payload = yield addToCart_models_1.AddToCart.create({
        productImage: productImageAvatar === null || productImageAvatar === void 0 ? void 0 : productImageAvatar.url,
        productName,
        unitPrice,
        quantity,
        userId: user === null || user === void 0 ? void 0 : user._id,
        total,
    });
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, payload, "data uploaded successfully"));
}));
exports.addToCartController = addToCartController;
const getAddToCartController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield addToCart_models_1.AddToCart.find();
    if (!payload)
        throw new ApiError_1.ApiError(400, "no data has been retrieved");
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfull"));
}));
exports.getAddToCartController = getAddToCartController;
const getAddToCartByUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = yield addToCart_models_1.AddToCart.find({ userId: id });
    if (!payload)
        throw new ApiResponse_1.ApiResponse(400, "no data found in database");
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfull"));
}));
exports.getAddToCartByUser = getAddToCartByUser;
const updateAddToCart = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity == null) {
        throw new ApiError_1.ApiError(400, "Quantity is required");
    }
    const payload = yield addToCart_models_1.AddToCart.findByIdAndUpdate(id, { $set: { quantity } }, { new: true });
    if (!payload)
        throw new ApiError_1.ApiError(400, "Update failed");
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, payload, " updated successfully"));
}));
exports.updateAddToCart = updateAddToCart;
const deleteAddToCart = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = yield addToCart_models_1.AddToCart.findByIdAndDelete(id);
    if (!payload)
        throw new ApiError_1.ApiError(400, "no data found");
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data deleted succcessfull"));
}));
exports.deleteAddToCart = deleteAddToCart;
