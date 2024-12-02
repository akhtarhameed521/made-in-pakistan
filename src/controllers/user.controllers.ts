import { Request, Response, NextFunction, CookieOptions } from "express";
import { User, IUser } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { uploadOnCloudinary } from "../utils/cloudinary";

// Interface for the request body in userRegistration handler
interface UserRegistrationRequestBody {
  name: string;
  email: string;
  phone: number;
  password: string;
  profilePhoto: string | undefined
}

// Interface for the request body in userLogin handler
interface UserLoginRequestBody {
  email: string;
  password: string;
}

// Custom Request interface that extends the Express.Request interface
interface CustomRequest extends Request {
  user?: IUser;
}

const generateAccessAndRefreshTokens = async (userId: any) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Register user handler
const userRegistration = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { name, email, password }: UserRegistrationRequestBody = req.body;

    // Check whether the user exists or not
    const existUser = await User.findOne({ email });
    
    if (existUser) {
      throw new ApiError(400, "email already exists");
    }
    let profilePhotoAvatar : any 
    if(req.file){
      const localFilePath = req.file?.path
      
       profilePhotoAvatar = await uploadOnCloudinary(localFilePath)

    }
    
    // Create the user
    const payload = await User.create({
      name,
      email,
      profilePhoto: profilePhotoAvatar?.url || "",
      password,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "User created successfully"));
  }
);

const updateUserProfile = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { name } = req.body;
    let profilePhoto;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    // Upload new profile photo if provided
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      profilePhoto = uploadResult?.secure_url;
    }

    req.user.name = name || req.user.name;
    req.user.profilePhoto = profilePhoto || req.user.profilePhoto;

    await req.user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "Profile updated successfully"));
  }
);

const deleteUser = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
  try {
    const {id} = req.params
    const payload = await User.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200, payload, "deleted successfully"))
  } catch (error) {
    next(error)
  }
})

// User login handler
const userLogin = asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { email, password }: UserLoginRequestBody = req.body;
  
        if (!(password || email)) {
          throw new ApiError(400, "Invalid credentials");
        }
  
        const user = await User.findOne({ email }).select("+password");
  
        if (!user) {
          throw new ApiError(400, "email does not exist");
        }
  
        console.log("Retrieved user:", user); // Debugging line
  
        const isPasswordValid = await user.isPasswordCorrect(password);
  
        if (!isPasswordValid) {
          throw new ApiError(400, "invalid user credential");
        }
  
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  
  
        const loggedInUser = await User.findById(user._id).select(" -refreshToken");
  
        const options: CookieOptions = {
          httpOnly: true,
          sameSite: "strict",
        };
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse(
              200,
              {
                user: loggedInUser,
                accessToken,
                refreshToken,
              },
              "User logged In Successfully"
            )
          );
      } catch (error) {
        next(error);
      }
    }
  );
  

// Logout the user handler
const logoutUser = asyncHandler(async (req: CustomRequest, res) => {
  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options: CookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure:false
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken: any = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req?.user, "current user fetched successfully")
      );
  }
);

const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

const sendResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
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

  await transporter.sendMail(mailOptions);
};

// Password reset request handler
const requestPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendResetEmail(email, resetToken);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset email sent successfully"));
  }
);

// Password reset handler
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      throw new ApiError(400, "Password donot match")
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, 'Password reset token is invalid or has expired');
    }

    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, 'Password reset successful'));
});


const changePassword = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { currentPassword, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new ApiError(400, "New passwords do not match");
    }

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    await req.user.changePassword(currentPassword, password);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  }
);

const generateOTP = (): string => {
  return crypto.randomBytes(3).toString('hex'); 
};

const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
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
  await transporter.sendMail(mailOptions);
};

const requestChangeEmailOTP = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { newEmail } = req.body;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const otp = generateOTP();
    req.user.otp = otp;
    req.user.otpExpires = Date.now() + 10 * 60 * 1000; 

    await req.user.save();

    await sendOTPEmail(newEmail, otp);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent to the new email address"));
  }
);

const verifyOTPAndChangeEmail = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { email, otp } = req.body;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (
      req.user.otp !== otp ||
      !req.user.otpExpires ||
      Date.now() > req.user.otpExpires
    ) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    req.user.email = email;
    req.user.otp = undefined;
    req.user.otpExpires = undefined;

    await req.user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email changed successfully"));
  }
);


export {
  userRegistration,
  userLogin,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  requestChangeEmailOTP,
  verifyOTPAndChangeEmail,
  updateUserProfile,
  deleteUser
};
