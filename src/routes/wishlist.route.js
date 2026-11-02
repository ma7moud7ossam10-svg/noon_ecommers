
const express = require("express");
const router = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
} = require("../controllers/wishlist.controller.js");

const { protect } = require("../middlewere/authMiddleware.js");

router.use(protect);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.delete("/", clearWishlist);
router.get("/check/:productId", checkWishlist);
module.exports = router;
