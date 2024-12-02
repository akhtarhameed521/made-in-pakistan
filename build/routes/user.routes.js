"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const validator_middleware_1 = __importDefault(require("../middleware/validator.middleware"));
const validator_1 = require("../utils/validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.route("/register").post(upload_middleware_1.upload.single("profilePhoto"), (0, validator_middleware_1.default)(validator_1.validator), user_controllers_1.userRegistration);
router.route("/login").post(user_controllers_1.userLogin);
router.route("/logout").post(auth_middleware_1.verifyJWT, user_controllers_1.logoutUser);
router.route("/current-user").get(auth_middleware_1.verifyJWT, user_controllers_1.getCurrentUser);
router.route("/delete-user/:id").delete(auth_middleware_1.verifyJWT, user_controllers_1.deleteUser);
router.route("/update-profile/:id").put(upload_middleware_1.upload.single("profilePhoto"), auth_middleware_1.verifyJWT, user_controllers_1.updateUserProfile);
// Example admin route
router.route("/admin-route").get(auth_middleware_1.verifyJWT, (0, role_middleware_1.verifyRole)(["admin"]), (req, res) => {
    res.status(200).json({ message: "Admin content" });
});
// Example user route
router.route("/user-route").get(auth_middleware_1.verifyJWT, (0, role_middleware_1.verifyRole)(["user", "admin"]), (req, res) => {
    res.status(200).json({ message: "User content" });
});
router.route('/request-password-reset').post(user_controllers_1.requestPasswordReset);
router.route('/reset-password').post(user_controllers_1.resetPassword);
router.route("/change-password").post(auth_middleware_1.verifyJWT, user_controllers_1.changePassword);
router.post("/request-change-email-otp", auth_middleware_1.verifyJWT, user_controllers_1.requestChangeEmailOTP);
// otp genarate
router.post("/verify-otp-and-change-email", auth_middleware_1.verifyJWT, user_controllers_1.verifyOTPAndChangeEmail);
// after otp written will verify and email changed 
exports.default = router;
