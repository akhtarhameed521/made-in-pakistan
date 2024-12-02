import { Router } from "express";
import { changePassword, deleteUser, getCurrentUser, logoutUser, refreshAccessToken, requestChangeEmailOTP, requestPasswordReset, resetPassword, updateUserProfile, userLogin, userRegistration, verifyOTPAndChangeEmail } from "../controllers/user.controllers";
import validate from "../middleware/validator.middleware";
import { validator } from "../utils/validator";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyRole } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.route("/register").post( upload.single("profilePhoto"), validate(validator),  userRegistration);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/delete-user/:id").delete(verifyJWT, deleteUser);
router.route("/update-profile/:id").put( upload.single("profilePhoto"), verifyJWT,  updateUserProfile)

// Example admin route
router.route("/admin-route").get(verifyJWT, verifyRole(["admin"]), (req, res) => {
    res.status(200).json({ message: "Admin content" });
});

// Example user route
router.route("/user-route").get(verifyJWT, verifyRole(["user", "admin"]), (req, res) => {
    res.status(200).json({ message: "User content" });
});


router.route('/request-password-reset').post(requestPasswordReset);
router.route('/reset-password').post(resetPassword);
router.route("/change-password").post(verifyJWT, changePassword);


router.post("/request-change-email-otp", verifyJWT, requestChangeEmailOTP);
// otp genarate

router.post("/verify-otp-and-change-email", verifyJWT, verifyOTPAndChangeEmail);
// after otp written will verify and email changed 


export default router;
