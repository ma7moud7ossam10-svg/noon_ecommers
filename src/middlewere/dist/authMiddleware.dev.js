"use strict";

var jwt = require("jsonwebtoken");

var _require = require("../../../../Downloads/authMiddleware"),
    protect = _require.protect;

var Protect = function Protect(req, res, next) {
  try {
    var authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startswith("Bearer")) {
      return res.status(401).json({
        message: "no token provided"
      });
    }

    var token = authHeader.split("")[1];
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      error: error.message
    });
  }
};

module.exports = {
  protect: protect
};