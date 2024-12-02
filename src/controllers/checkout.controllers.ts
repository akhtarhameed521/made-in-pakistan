import {Request, Response} from "express"
import { asyncHandler } from "../utils/asyncHandler";
import { Checkout } from "../models/checkout.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.models";
import jwt from "jsonwebtoken"

interface CheckoutRequestBody {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: number;
    country: string;
    addressLine1: string
    addressLine2: string
    cartSubtotal: number,
    shippingCost: number
}

interface CustomRequest extends Request {
    body: CheckoutRequestBody
}

const checkoutController = asyncHandler(async(req: CustomRequest, res: Response)=>{
    const {firstName, lastName, emailAddress, phoneNumber, country, addressLine1, addressLine2, cartSubtotal, shippingCost} = req.body
    const token = req.cookies.accessToken;
    const decoded: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    const payload = await Checkout.create({
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        country,
        userId : user?._id,
        addressLine1,
        addressLine2,
        cartSubtotal,
        shippingCost
    })
    if(!payload) throw new ApiError(400, "checkout not found")
    return res.status(200).json(new ApiResponse(200, payload, "data uploaded successfully"))
})

const getCheckoutController = asyncHandler(async(req: CustomRequest, res: Response)=>{
    const payload = await Checkout.find()
    if(!payload) throw new ApiError(400, "no data found in checkout")
    return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfullu"))
})

const getCheckoutByUser = asyncHandler(async(req: CustomRequest, res: Response)=>{
    const {id} = req.params
    const payload = await Checkout.find({userId: id})
    if(!payload) throw new ApiError(400, "no data found in checkout")
    return res.status(200).json(new ApiResponse(200, payload, "data retrieved successfullu"))
})

export {checkoutController, getCheckoutByUser, getCheckoutController}