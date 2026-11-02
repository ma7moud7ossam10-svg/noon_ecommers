const express = require("express");
const { register, login, getProfile } = require("../controllers/auth.controller.js");
const { protect } = require("../middlewere/authMiddleware.js");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);

module.exports = router;
