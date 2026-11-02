const mongoose = require("mongoose");
const Product = require("../models/product.model.js");
const Wishlist = require("../models/wishlist.model.js");

const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
        return res.status(200).json({
            products: wishlist ? wishlist.products : []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error getting wishlist",
            error: error.message
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body || {};
        if (!productId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "A valid productId is required"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: req.user.id },
            {
                $addToSet: { products: product._id },
                $setOnInsert: { user: req.user.id }
            },
            { new: true, upsert: true }
        ).populate("products");

        return res.status(200).json({
            message: "Product added to wishlist",
            wishlist
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error adding product to wishlist",
            error: error.message
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "A valid productId is required"
            });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { products: productId } },
            { new: true }
        ).populate("products");

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }

        return res.status(200).json({
            message: "Product removed from wishlist",
            wishlist
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error removing product from wishlist",
            error: error.message
        });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { user: req.user.id },
            { $set: { products: [] } },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }

        return res.status(200).json({
            message: "Wishlist cleared successfully",
            wishlist
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error clearing wishlist",
            error: error.message
        });
    }
};

const checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "A valid productId is required"
            });
        }

        const wishlist = await Wishlist.findOne(
            { user: req.user.id },
            { products: 1 }
        );
        const isInWishlist = Boolean(
            wishlist && wishlist.products.some((id) => id.toString() === productId)
        );

        return res.status(200).json({
            productId,
            isInWishlist
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error checking wishlist",
            error: error.message
        });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist
};
