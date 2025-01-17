"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const zod_1 = require("zod");
const validator = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Username is required" })
        .trim()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(255, { message: "Username must not be more than 255 characters" }),
    email: zod_1.z.string({ required_error: "Email is required" })
        .trim()
        .min(3, { message: "Email must be at least 3 characters" })
        .max(255, { message: "Email must not be more than 255 characters" }),
    password: zod_1.z.string({ required_error: "Password is required" })
        .trim()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(20, { message: "Password must not be more than 20 characters" }),
    confirmPassword: zod_1.z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword']
});
exports.validator = validator;
