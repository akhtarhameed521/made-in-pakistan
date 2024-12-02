import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiError } from "../utils/ApiError";
import { AddToWishList } from "../models/addToWhishList.models";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.models";
import jwt from "jsonwebtoken";

interface AddToWishListRequestBody {
  productImage: string;
  productName: string;
  total: number;
}

interface CustomRequest extends Request {
  body: AddToWishListRequestBody;
}

const addToWishListController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {
      productImage,
      productName,
      total,
    }: AddToWishListRequestBody = req.body;
    const localFileAvatar = req.file?.path;
    if (!localFileAvatar) throw new ApiError(400, "no local file found");
    const productImageAvatar = await uploadOnCloudinary(localFileAvatar);
    const token = req.cookies.accessToken;
    const decoded: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    const payload = await AddToWishList.create({
      productImage: productImageAvatar?.url,
      productName,
     
      userId: user?._id,
      total,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "data uploaded successfully"));
  }
);

const getAddToWishListController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const payload = await AddToWishList.find();
    if (!payload) throw new ApiError(400, "no data has been retrieved");
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "data retrieved successfull"));
  }
);

const getAddToWishListByUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {id} = req.params
    const payload = await AddToWishList.find({userId: id});
    if(!payload) throw new ApiResponse(400, "no data found in database")
    return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfull"))
  }
);

const deleteAddToWishList = asyncHandler(async(req: CustomRequest, res: Response)=>{
    const {id} = req.params
    const payload = await AddToWishList.findByIdAndDelete(id)
    if(!payload) throw new ApiError(400, "no data found")
    return res.status(200).json(new ApiResponse(200, payload, "data deleted succcessfull"))
})

export {addToWishListController, getAddToWishListController, getAddToWishListByUser,  deleteAddToWishList}