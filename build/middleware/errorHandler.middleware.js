"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json(new ApiResponse_1.ApiResponse(err.statusCode, null, err.message));
    }
    return res.status(500).json(new ApiResponse_1.ApiResponse(500, null, "Internal server error"));
};
exports.errorHandler = errorHandler;
