import mongoose, { Document, Schema, Types } from "mongoose";

interface IReview extends Document {
    reviewBy: string;
    productTitle: string;
    review: string;
    rate: string;
    status: string,
    userId: Types.ObjectId
}

const reviewSchema : Schema<IReview> = new Schema({
    reviewBy: {
        type: String,
        trim: true,
        required: true
    },
    productTitle:{
        type: String,
        trim: true,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    rate :{
        type: String,
        trim: true,
        required: true
    },
    status :{
        type: String,
        trim: true,
        required: true
    },
   
},  {
    timestamps: true
} )

export const Review = mongoose.model<IReview>("review", reviewSchema)