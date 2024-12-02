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
exports.deleteSettingController = exports.getSettingController = exports.updateSettingController = exports.settingController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const cloudinary_1 = require("../utils/cloudinary");
const setting_models_1 = require("../models/setting.models");
const ApiResponse_1 = require("../utils/ApiResponse");
const settingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const customReq = req;
        const { footerText, aboutText, address, email, number } = customReq.body;
        console.log('Files: ', customReq.files); // Log the files object
        const footerLogoFile = (_b = (_a = customReq.files['footerLogo']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
        const headerLogoFile = (_d = (_c = customReq.files['headerLogo']) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
        if (!headerLogoFile) {
            throw new ApiError_1.ApiError(400, 'Header logo is required');
        }
        if (!footerLogoFile) {
            throw new ApiError_1.ApiError(400, 'Footer logo is required');
        }
        const footerLogoUpload = yield (0, cloudinary_1.uploadOnCloudinary)(footerLogoFile);
        const headerLogoUpload = yield (0, cloudinary_1.uploadOnCloudinary)(headerLogoFile);
        const payload = yield setting_models_1.Setting.create({
            footerText,
            aboutText,
            headerLogo: headerLogoUpload === null || headerLogoUpload === void 0 ? void 0 : headerLogoUpload.url,
            footerLogo: footerLogoUpload === null || footerLogoUpload === void 0 ? void 0 : footerLogoUpload.url,
            address,
            email,
            number
        });
        if (!payload)
            throw new ApiError_1.ApiError(400, "Failed to save settings");
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, payload, "Settings saved successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.settingController = settingController;
const getSettingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield setting_models_1.Setting.find();
        if (!payload.length)
            throw new ApiError_1.ApiError(400, "no data found");
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, 'data retrieved successfully'));
    }
    catch (error) {
        next(error);
    }
}));
exports.getSettingController = getSettingController;
const updateSettingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const customReq = req;
        const { footerText, aboutText, address, email, number } = customReq.body;
        // Find the existing setting
        const setting = yield setting_models_1.Setting.findById(id);
        if (!setting) {
            throw new ApiError_1.ApiError(404, 'Setting not found');
        }
        // Handle file uploads if new files are provided
        let headerLogoUrl = setting.headerLogo;
        let footerLogoUrl = setting.footerLogo;
        if (customReq.files) {
            if (customReq.files['headerLogo'] && customReq.files['headerLogo'][0]) {
                const headerLogoFile = customReq.files['headerLogo'][0].path;
                const headerLogoUpload = yield (0, cloudinary_1.uploadOnCloudinary)(headerLogoFile);
                headerLogoUrl = headerLogoUpload === null || headerLogoUpload === void 0 ? void 0 : headerLogoUpload.url;
            }
            if (customReq.files['footerLogo'] && customReq.files['footerLogo'][0]) {
                const footerLogoFile = customReq.files['footerLogo'][0].path;
                const footerLogoUpload = yield (0, cloudinary_1.uploadOnCloudinary)(footerLogoFile);
                footerLogoUrl = footerLogoUpload === null || footerLogoUpload === void 0 ? void 0 : footerLogoUpload.url;
            }
        }
        // Update the setting with new data
        setting.footerText = footerText || setting.footerText;
        setting.aboutText = aboutText || setting.aboutText;
        setting.headerLogo = headerLogoUrl;
        setting.footerLogo = footerLogoUrl;
        setting.address = address || setting.address;
        setting.email = email || setting.email;
        setting.number = number || setting.number;
        yield setting.save();
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, setting, "Settings updated successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.updateSettingController = updateSettingController;
const deleteSettingController = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield setting_models_1.Setting.findByIdAndDelete(id);
        if (!payload)
            throw new ApiError_1.ApiError(400, 'failed delete');
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "delete successfull"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteSettingController = deleteSettingController;
