"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/wishlist.controller"),
    getWishlist = _require.getWishlist,
    addToWishlist = _require.addToWishlist,
    removeFromWishlist = _require.removeFromWishlist,
    clearWishlist = _require.clearWishlist,
    checkWishlist = _require.checkWishlist;

var authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);
router.get("/", getWishlist);
router.post("/", addToWishlist);
router["delete"]("/:productId", removeFromWishlist);
router["delete"]("/", clearWishlist);
router.get("/check/:productId", checkWishlist);
module.exports = router;