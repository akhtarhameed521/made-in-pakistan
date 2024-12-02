import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICart extends Document{
    productImage: string | undefined,
    productName: string,
    unitPrice: number,
    quantity: number,
    total: number
    userId: Types.ObjectId
}

const addToCartSchema : Schema<ICart> = new Schema({
    productImage:{
        type: String,
        required: true,
        trim: true
    },
    productName :{
        type : String,
        requred: true,
        trim: true
    },
    unitPrice:{
        type: Number,
        required: true,
        trim: true,
    },
    quantity :{
        type: Number,
        required: true,
        trim: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    total:{
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

export const AddToCart = mongoose.model<ICart>("addToCart", addToCartSchema)