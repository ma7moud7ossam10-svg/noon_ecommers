"use strict";

var express = require("express");

var router = express.Router();

var cartController = require("../controllers/cart.controller");

var authMiddleware = require("../middleware/auth.middleware"); // All cart routes require authentication


router.use(authMiddleware);
router.get("/", cartController.getCart);
router.post("/items", cartController.addToCart);
router.put("/items/:productId", cartController.updateCartItem);
router["delete"]("/items/:productId", cartController.removeFromCart);
router["delete"]("/", cartController.clearCart);
module.exports = router;