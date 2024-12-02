import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiError } from "../utils/ApiError";
import { AddToCart } from "../models/addToCart.models";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.models";
import jwt from "jsonwebtoken";

interface AddToCartRequestBody {
  productImage: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface CustomRequest extends Request {
  body: AddToCartRequestBody;
}

const addToCartController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {
      productImage,
      productName,
      unitPrice,
      quantity,
      total,
    }: AddToCartRequestBody = req.body;
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
    const payload = await AddToCart.create({
      productImage: productImageAvatar?.url,
      productName,
      unitPrice,
      quantity,
      userId: user?._id,
      total,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "data uploaded successfully"));
  }
);

const getAddToCartController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const payload = await AddToCart.find();
    if (!payload) throw new ApiError(400, "no data has been retrieved");
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "data retrieved successfull"));
  }
);

const getAddToCartByUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {id} = req.params
    const payload = await AddToCart.find({userId: id});
    if(!payload) throw new ApiResponse(400, "no data found in database")
    return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfull"))
  }
);

const updateAddToCart = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
  
    if (quantity == null) {
      throw new ApiError(400, "Quantity is required");
    }
  
    const payload = await AddToCart.findByIdAndUpdate(
      id,
      { $set: { quantity } },
      { new: true }
    );
  
    if (!payload) throw new ApiError(400, "Update failed");
  
    return res
      .status(200)
      .json(new ApiResponse(200, payload, " updated successfully"));
  });
  

const deleteAddToCart = asyncHandler(async(req: CustomRequest, res: Response)=>{
    const {id} = req.params
    const payload = await AddToCart.findByIdAndDelete(id)
    if(!payload) throw new ApiError(400, "no data found")
    return res.status(200).json(new ApiResponse(200, payload, "data deleted succcessfull"))
})

export {addToCartController, getAddToCartController, getAddToCartByUser, updateAddToCart, deleteAddToCart}