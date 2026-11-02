
const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controllers.js");
const { protect } = require("../middlewere/authMiddleware.js");

// All cart routes require authentication
router.use(protect);

router.get("/", cartController.getCart);

router.post("/", cartController.addToCart);

router.post("/items", cartController.addToCart);

router.put("/items/:productId", cartController.updateCartItem);

router.delete("/items/:productId", cartController.removeFromCart);

router.delete("/", cartController.clearCart);

module.exports = router;
