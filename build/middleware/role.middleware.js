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
exports.verifyRole = void 0;
const user_models_1 = require("../models/user.models");
const ApiError_1 = require("../utils/ApiError");
const verifyRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const user = yield user_models_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
            if (!user || !roles.includes(user.role)) {
                throw new ApiError_1.ApiError(403, "Forbidden");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.verifyRole = verifyRole;
