import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
    orderNumber: string;
    name: string;
    email: string;
    userId: Types.ObjectId; // Correct type for userId
    quantity: number;
    charge: number;
    totalAmount: number;
    status: string;
}

const orderSchema: Schema<IOrder> = new Schema({
    orderNumber: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    quantity: {
        type: Number,
        trim: true,
        required: true
    },
    charge: {
        type: Number,
        trim: true,
        required: true
    },
    totalAmount: {
        type: Number,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim: true,
        required: true
    }
},{
    timestamps: true
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
