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
exports.getCheckoutController = exports.getCheckoutByUser = exports.checkoutController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const checkout_models_1 = require("../models/checkout.models");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const user_models_1 = require("../models/user.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkoutController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, emailAddress, phoneNumber, country, addressLine1, addressLine2, cartSubtotal, shippingCost } = req.body;
    const token = req.cookies.accessToken;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = yield user_models_1.User.findById(decoded._id).select("-password -refreshToken");
    const payload = yield checkout_models_1.Checkout.create({
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        country,
        userId: user === null || user === void 0 ? void 0 : user._id,
        addressLine1,
        addressLine2,
        cartSubtotal,
        shippingCost
    });
    if (!payload)
        throw new ApiError_1.ApiError(400, "checkout not found");
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data uploaded successfully"));
}));
exports.checkoutController = checkoutController;
const getCheckoutController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield checkout_models_1.Checkout.find();
    if (!payload)
        throw new ApiError_1.ApiError(400, "no data found in checkout");
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfullu"));
}));
exports.getCheckoutController = getCheckoutController;
const getCheckoutByUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = yield checkout_models_1.Checkout.find({ userId: id });
    if (!payload)
        throw new ApiError_1.ApiError(400, "no data found in checkout");
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfullu"));
}));
exports.getCheckoutByUser = getCheckoutByUser;
