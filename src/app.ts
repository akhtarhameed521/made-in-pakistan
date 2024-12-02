  import express, { urlencoded } from "express"
  import cookieParser from "cookie-parser"
  import cors from "cors";


const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200
  }));

app.use(express())
app.use(express.json())
app.use(express.urlencoded({extended: false, limit: "16kb"}))
app.use(cookieParser())


import banner from "./routes/banner.routes"
import { errorHandler } from "./middleware/errorHandler.middleware"

import category from "./routes/category.routes"
import brand from "./routes/brand.routes"
import shipping from "./routes/shipping.routes"
import order from "./routes/order.routes"
import tag from "./routes/tag.routes"
import setting from "./routes/setting.routes"
import coupon from "./routes/coupan.routes"
import post from "./routes/post.routes"
import product from "./routes/product.route"
import user from "./routes/user.routes"
import review from "./routes/review.routes"
import addCategory from "./routes/addCategory.routes"
import addToCart from "./routes/addToCart.routes"
import addToWishList from "./routes/addToWishList.routes"
import checkout from "./routes/checkout.routes"

app.use("/api", addToCart)
app.use("/api", banner )
app.use("/api", category )
app.use("/api", brand)
app.use("/api", shipping)
app.use("/api", order )
app.use("/api", tag )
app.use("/api", setting)
app.use("/api", coupon)
app.use("/api", post )
app.use("/api", product )
app.use("/api", user )
app.use("/api", review )
app.use("/api", addCategory )
app.use('/api', addToWishList)
app.use("/api", checkout )

//this is error handling middleware

app.use(errorHandler)


export {app}