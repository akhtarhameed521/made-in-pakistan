import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWishList extends Document{
    productImage: string | undefined,
    productName: string,
    total: number
    userId: Types.ObjectId
}

const addToWishListSchema : Schema<IWishList> = new Schema({
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

export const AddToWishList = mongoose.model<IWishList>("addToWishList", addToWishListSchema)