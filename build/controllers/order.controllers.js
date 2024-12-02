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
exports.getOrderByUser = exports.deleteOrderController = exports.updateOrderController = exports.getOrderController = exports.orderController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const order_models_1 = require("../models/order.models");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_models_1 = require("../models/user.models");
const orderController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNumber, name, email, userId, quantity, charge, totalAmount, status } = req.body;
        let randomSerial = 'abcdefgijklmnopqrstuvwxyz';
        let generateSerial = '';
        for (let i = 0; i < 10; i++) {
            generateSerial += randomSerial.charAt(Math.floor(Math.random() * randomSerial.length));
        }
        const token = req.cookies.accessToken;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = yield user_models_1.User.findById(decoded._id).select('-password -refreshToken');
        const finalOrderNumber = `ORD-${generateSerial}`.toUpperCase();
        const payload = yield order_models_1.Order.create({
            orderNumber: finalOrderNumber,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            userId: user === null || user === void 0 ? void 0 : user._id,
            quantity,
            charge,
            totalAmount,
            status
        });
        if (!payload)
            throw new ApiError_1.ApiError(400, "no order has received ");
        res.status(201).json(new ApiResponse_1.ApiResponse(200, payload, "order received successfull"));
    }
    catch (error) {
        next(error);
    }
}));
exports.orderController = orderController;
const getOrderController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield order_models_1.Order.find();
        if (!payload)
            throw new ApiError_1.ApiError(400, "no order has received");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "order received successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getOrderController = getOrderController;
const getOrderByUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log(req.params);
    const payload = yield order_models_1.Order.find({ userId: userId });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "User's order retrieved successfully"));
}));
exports.getOrderByUser = getOrderByUser;
const updateOrderController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const payload = yield order_models_1.Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!payload)
            throw new ApiError_1.ApiError(400, "update failed");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "update successful"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateOrderController = updateOrderController;
const deleteOrderController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield order_models_1.Order.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, "deleted failed");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "deleted successfull"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteOrderController = deleteOrderController;
