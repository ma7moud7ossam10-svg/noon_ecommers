"use strict";

var mongoose = require("mongoose");

var wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model("wishlist", wishlistSchema);