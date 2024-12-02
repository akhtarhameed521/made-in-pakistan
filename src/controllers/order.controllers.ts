import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Order } from "../models/order.models";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models";

interface OrderRequestBody {
    orderNumber: string;
    name: string;
    email: string;
    userId: Types.ObjectId
    quantity: number;
    charge: number;
    totalAmount: number;
    status: string;
}

interface CustomRequest extends Request {
    body: OrderRequestBody;
}

const orderController = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { orderNumber, name, email, userId, quantity, charge, totalAmount, status } = req.body;

        let randomSerial: string = 'abcdefgijklmnopqrstuvwxyz';
        let generateSerial: string = '';
        for (let i = 0; i < 10; i++) {
            generateSerial += randomSerial.charAt(Math.floor(Math.random() * randomSerial.length));
        }

        const token = req.cookies.accessToken
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        const user = await User.findById(decoded._id).select('-password -refreshToken');
        
        
        const finalOrderNumber = `ORD-${generateSerial}`.toUpperCase();

        const payload = await Order.create({
            orderNumber: finalOrderNumber,
            name : user?.name ,
            email : user?.email ,
            userId: user?._id,
            quantity,
            charge,
            totalAmount,
            status
        });

        if(!payload) throw new ApiError(400, "no order has received ")

        res.status(201).json(new ApiResponse(200, payload, "order received successfull"));
    } catch (error) {
        next(error);
    }
});

const getOrderController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const payload = await Order.find()
        if(!payload) throw new ApiError(400, "no order has received")
        return res.status(200).json(new ApiResponse(200, payload, "order received successfully"))
    } catch (error) {
        next(error)
    }
})

const getOrderByUser = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    
    const {userId} = req.params
    console.log(req.params)
    const payload = await Order.find({userId : userId})
    return res.status(200).json(new ApiResponse(200, payload, "User's order retrieved successfully"))
})

const updateOrderController = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const payload = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!payload) throw new ApiError(400, "update failed");
        return res.status(200).json(new ApiResponse(200, payload, "update successful"));
    } catch (error) {
        next(error);
    }
});


const deleteOrderController = asyncHandler(async(req: CustomRequest, res: Response, next: NextFunction)=>{
    try {
        const {id} = req.params
        const payload = await Order.findByIdAndDelete(id)
        if(!payload) throw new ApiError(400, "deleted failed")
        return res.status(200).json(new ApiResponse(200, payload, "deleted successfull"))
    } catch (error) {
        next(error)
    }
})

export { orderController, getOrderController, updateOrderController, deleteOrderController, getOrderByUser };

