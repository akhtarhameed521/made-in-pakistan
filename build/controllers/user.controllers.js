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
exports.deleteUser = exports.updateUserProfile = exports.verifyOTPAndChangeEmail = exports.requestChangeEmailOTP = exports.changePassword = exports.resetPassword = exports.requestPasswordReset = exports.getCurrentUser = exports.refreshAccessToken = exports.logoutUser = exports.userLogin = exports.userRegistration = void 0;
const user_models_1 = require("../models/user.models");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = require("../utils/cloudinary");
const generateAccessAndRefreshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_models_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accessToken = yield user.generateAccessToken();
        const refreshToken = yield user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while generating refresh and access token");
    }
});
// Register user handler
const userRegistration = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, password } = req.body;
    // Check whether the user exists or not
    const existUser = yield user_models_1.User.findOne({ email });
    if (existUser) {
        throw new ApiError_1.ApiError(400, "email already exists");
    }
    let profilePhotoAvatar;
    if (req.file) {
        const localFilePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        profilePhotoAvatar = yield (0, cloudinary_1.uploadOnCloudinary)(localFilePath);
    }
    // Create the user
    const payload = yield user_models_1.User.create({
        name,
        email,
        profilePhoto: (profilePhotoAvatar === null || profilePhotoAvatar === void 0 ? void 0 : profilePhotoAvatar.url) || "",
        password,
    });
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, payload, "User created successfully"));
}));
exports.userRegistration = userRegistration;
const updateUserProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    let profilePhoto;
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    // Upload new profile photo if provided
    if (req.file) {
        const uploadResult = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
        profilePhoto = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    req.user.name = name || req.user.name;
    req.user.profilePhoto = profilePhoto || req.user.profilePhoto;
    yield req.user.save();
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, req.user, "Profile updated successfully"));
}));
exports.updateUserProfile = updateUserProfile;
const deleteUser = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payload = yield user_models_1.User.findByIdAndDelete(id);
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, payload, "deleted successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteUser = deleteUser;
// User login handler
const userLogin = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!(password || email)) {
            throw new ApiError_1.ApiError(400, "Invalid credentials");
        }
        const user = yield user_models_1.User.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError_1.ApiError(400, "email does not exist");
        }
        console.log("Retrieved user:", user); // Debugging line
        const isPasswordValid = yield user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError_1.ApiError(400, "invalid user credential");
        }
        const { accessToken, refreshToken } = yield generateAccessAndRefreshTokens(user._id);
        const loggedInUser = yield user_models_1.User.findById(user._id).select(" -refreshToken");
        const options = {
            httpOnly: true,
            sameSite: "strict",
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse_1.ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken,
        }, "User logged In Successfully"));
    }
    catch (error) {
        next(error);
    }
}));
exports.userLogin = userLogin;
// Logout the user handler
const logoutUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield user_models_1.User.findByIdAndUpdate((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, {
        $unset: {
            refreshToken: 1, // this removes the field from document
        },
    }, {
        new: true,
    });
    const options = {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse_1.ApiResponse(200, {}, "User logged Out"));
}));
exports.logoutUser = logoutUser;
const refreshAccessToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError_1.ApiError(401, "unauthorized request");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield user_models_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id);
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== (user === null || user === void 0 ? void 0 : user.refreshToken)) {
            throw new ApiError_1.ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
        };
        const { accessToken, refreshToken } = yield generateAccessAndRefreshTokens(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, (error === null || error === void 0 ? void 0 : error.message) || "Invalid refresh token");
    }
}));
exports.refreshAccessToken = refreshAccessToken;
const getCurrentUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, req === null || req === void 0 ? void 0 : req.user, "current user fetched successfully"));
}));
exports.getCurrentUser = getCurrentUser;
const generateResetToken = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
const sendResetEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: "bhurtsahab786521@gmail.com",
            pass: "XO6RhS9VbTmYNMcI",
        },
    });
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Reset Request",
        // html: `<p>You requested a password reset. Please make a PUT request to the following URL to reset your password:<a href =" ${resetURL}">here<p>`,
        html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`
    };
    yield transporter.sendMail(mailOptions);
});
// Password reset request handler
const requestPasswordReset = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_models_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    yield user.save();
    yield sendResetEmail(email, resetToken);
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Password reset email sent successfully"));
}));
exports.requestPasswordReset = requestPasswordReset;
// Password reset handler
const resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
        throw new ApiError_1.ApiError(400, "Password donot match");
    }
    const user = yield user_models_1.User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Password reset token is invalid or has expired');
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    yield user.save();
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Password reset successful'));
}));
exports.resetPassword = resetPassword;
const changePassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        throw new ApiError_1.ApiError(400, "New passwords do not match");
    }
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    yield req.user.changePassword(currentPassword, password);
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Password changed successfully"));
}));
exports.changePassword = changePassword;
const generateOTP = () => {
    return crypto_1.default.randomBytes(3).toString('hex');
};
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: "bhurtsahab786521@gmail.com",
            pass: "XO6RhS9VbTmYNMcI",
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "OTP Verification for Email Change",
        text: `Your OTP for changing email is: ${otp}. It is valid for 10 minutes.`,
    };
    yield transporter.sendMail(mailOptions);
});
const requestChangeEmailOTP = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newEmail } = req.body;
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    const otp = generateOTP();
    req.user.otp = otp;
    req.user.otpExpires = Date.now() + 10 * 60 * 1000;
    yield req.user.save();
    yield sendOTPEmail(newEmail, otp);
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "OTP sent to the new email address"));
}));
exports.requestChangeEmailOTP = requestChangeEmailOTP;
const verifyOTPAndChangeEmail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    if (req.user.otp !== otp ||
        !req.user.otpExpires ||
        Date.now() > req.user.otpExpires) {
        throw new ApiError_1.ApiError(400, "Invalid or expired OTP");
    }
    req.user.email = email;
    req.user.otp = undefined;
    req.user.otpExpires = undefined;
    yield req.user.save();
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Email changed successfully"));
}));
exports.verifyOTPAndChangeEmail = verifyOTPAndChangeEmail;
