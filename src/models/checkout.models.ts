import mongoose, { Schema, Types } from "mongoose";
import { Document } from "mongoose";

export interface ICheckout extends Document{
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: number;
    country: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    userId: Types.ObjectId;
    cartSubtotal: number;
    shippingCost: number;
}

const checkoutSchema : Schema<ICheckout> = new Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true

    },
    emailAddress:{
        type: String,
        required: true,
        trim: true
    },
    phoneNumber:{
        type: Number,
        required: true,
        trim: true
    },
    country:{
        type: String,
        required: true,
        trim: true
    },
    addressLine1:{
        type: String,
        
        trim: true
    },
    userId:{
        type : Schema.Types.ObjectId,
        required: true
    },
    addressLine2:{
        type: String,
        
        trim: true
    },
    postalCode:{
        type: String,
        
        trim: true
    },
    cartSubtotal:{
        type: Number,
        trim: true
    },
    shippingCost:{
        type: Number,
        trim: true
    }
})

export const Checkout = mongoose.model<ICheckout>("checkout", checkoutSchema)