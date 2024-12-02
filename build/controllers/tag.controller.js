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
exports.deleteTagController = exports.updateTagController = exports.getTagController = exports.tagController = void 0;
const ApiError_1 = require("../utils/ApiError");
const tag_models_1 = require("../models/tag.models");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const tagController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status } = req.body;
        const payload = yield tag_models_1.Tag.create({ title, status });
        yield payload.save();
        if (!payload)
            throw new ApiError_1.ApiError(400, "no data created at Tag");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "Tag created successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.tagController = tagController;
const getTagController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield tag_models_1.Tag.find();
        if (!payload.length)
            throw new ApiError_1.ApiError(400, "no data found in Tag");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "data retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.getTagController = getTagController;
const updateTagController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield tag_models_1.Tag.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true });
        if (!payload)
            throw new ApiError_1.ApiError(400, "update failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateTagController = updateTagController;
const deleteTagController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield tag_models_1.Tag.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, "delete failed !");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteTagController = deleteTagController;
