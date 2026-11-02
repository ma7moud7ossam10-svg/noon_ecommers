const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// express use 
dotenv.config();
const app = express();
app.use(express.json());
//Routes  URL 
const productRoutes= require("./routes/product.route.js");
const categoryRoutes= require( "./routes/category.route.js");
const orderRoutes= require( "./routes/order.route.js" );
const authRoutes = require("./routes/authRoutes.js");
const wishlistRoutes = require("./routes/wishlist.route.js");
const cartRoutes = require("./routes/cart.route.js");

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/cart", cartRoutes);

// GET , PUT , POST , DELETE 
// TEST URL Genral  
app.get("/",(req, res)=>{
    res.json({
        message :"API its ok"
    });
});

// Route don't exit 
app.use ((req, res , next )=>{
const error = new Error(`Route ${req.originalUrl} not found`);
error.status = 404;
next(error);
});
//  error handling 
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message });
});
const PORT= process.env.PORT||3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
if (!mongoUri) {
    console.error("Set MONGODB_URI or MONGO_URL in .env");
    process.exit(1);
}

mongoose.connect(mongoUri).then(()=> 
{
console.log("Monog connected");
app.listen (PORT,()=>{
    console.log(`server is connected on this ${PORT}`)
});
}).catch ((error )=>
{
    console.log ("database not connected");
    console.error(error);
    process.exitCode = 1;

});
