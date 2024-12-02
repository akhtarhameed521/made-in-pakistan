"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trime: true,
        required: true
    },
    summary: {
        type: String,
        trime: true,
        required: true
    },
    description: {
        type: String,
        trime: true,
    },
    isFeature: {
        type: Boolean,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    discount: {
        type: Number,
        trime: true,
    },
    size: {
        type: new Array,
        trim: true,
        required: true
    },
    brand: {
        type: String,
        trime: true,
    },
    condition: {
        type: String,
        trime: true,
        required: true
    },
    quantity: {
        type: Number,
        trime: true,
        required: true
    },
    photo: {
        type: String,
        trime: true,
        required: true
    },
    addMoreImages: {
        type: Array,
    },
    video: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});
exports.Product = mongoose_1.default.model("product", productSchema);
