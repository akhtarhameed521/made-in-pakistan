"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200
}));
app.use((0, express_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false, limit: "16kb" }));
app.use((0, cookie_parser_1.default)());
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const shipping_routes_1 = __importDefault(require("./routes/shipping.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const setting_routes_1 = __importDefault(require("./routes/setting.routes"));
const coupan_routes_1 = __importDefault(require("./routes/coupan.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const addCategory_routes_1 = __importDefault(require("./routes/addCategory.routes"));
const addToCart_routes_1 = __importDefault(require("./routes/addToCart.routes"));
const addToWishList_routes_1 = __importDefault(require("./routes/addToWishList.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
app.use("/api", addToCart_routes_1.default);
app.use("/api", banner_routes_1.default);
app.use("/api", category_routes_1.default);
app.use("/api", brand_routes_1.default);
app.use("/api", shipping_routes_1.default);
app.use("/api", order_routes_1.default);
app.use("/api", tag_routes_1.default);
app.use("/api", setting_routes_1.default);
app.use("/api", coupan_routes_1.default);
app.use("/api", post_routes_1.default);
app.use("/api", product_route_1.default);
app.use("/api", user_routes_1.default);
app.use("/api", review_routes_1.default);
app.use("/api", addCategory_routes_1.default);
app.use('/api', addToWishList_routes_1.default);
app.use("/api", checkout_routes_1.default);
//this is error handling middleware
app.use(errorHandler_middleware_1.errorHandler);
