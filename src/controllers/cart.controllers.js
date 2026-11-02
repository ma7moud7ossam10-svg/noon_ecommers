
const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// GET /cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: []
            });
        }

        const items = cart.items.map((item) => {
            const product = item.product;

            return {
                product: product,
                quantity: item.quantity,
                subtotal: product
                    ? product.price * item.quantity
                    : 0
            };
        });

        const total = items.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart: {
                _id: cart._id,
                items,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting cart",
            error: error.message
        });
    }
};

// POST /cart/items
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding product to cart",
            error: error.message
        });
    }
};

// PUT /cart/items/:productId
exports.updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            message: "Cart item updated successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating cart item",
            error: error.message
        });
    }
};

// DELETE /cart/items/:productId
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error removing product from cart",
            error: error.message
        });
    }
};

// DELETE /cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error clearing cart",
            error: error.message
        });
    }
};
