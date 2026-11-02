"use strict";

var wishlist = require("../models/wishlist.model.js");

var product = require("../models/product.model.js"); // get wishlist


var getwishlist = function getwishlist(req, res) {
  var _wishlist;

  return regeneratorRuntime.async(function getwishlist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_wishlist.findone({
            user: req.user.id
          }).populate("products"));

        case 3:
          _wishlist = _context.sent;
          res.status(200).json({
            products: _wishlist ? _wishlist.products : []
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "error getting wishlist",
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //Add product to wishlist


var addtowishlist = function addtowishlist(req, res) {
  var _productId, _product, _wishlist2;

  return regeneratorRuntime.async(function addtowishlist$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _productId = req.body.productId;

          if (_productId) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "product Id is required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(Product.findById(_productId));

        case 6:
          _product = _context2.sent;

          if (_product) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "product not found"
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(_wishlist2.findByIdAndupdate({
            user: req.user.id
          }, {
            $addToSet: {
              product: _product._id
            },
            $setOnInsert: {
              user: req.user._id
            }
          }, {
            "new": true,
            upsert: true
          }).populate("products"));

        case 11:
          _wishlist2 = _context2.sent;
          res.status(200).json({
            message: "product added to wishlist",
            wishlist: _wishlist2
          });
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "error.message"
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var removefromwishlist = function removefromwishlist(req, res) {
  var _productId2, _wishlist3;

  return regeneratorRuntime.async(function removefromwishlist$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _productId2 = req.params.productId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_wishlist3.findByIdAndupdate({
            user: req.user.id
          }, {
            $pull: {
              products: "productId"
            }
          }, {
            "new": true
          }).populate("products"));

        case 4:
          _wishlist3 = _context3.sent;

          if (_wishlist3) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "wishlist not found"
          }));

        case 7:
          res.status(200).json({
            message: "product removed from wishlist",
            wishlist: _wishlist3
          });
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "error Error removing product",
            error: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var clearWishlist = function clearWishlist(req, res) {
  var _wishlist4;

  return regeneratorRuntime.async(function clearWishlist$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Wishlist.findOneAndUpdate({
            user: req.user.id
          }, {
            $set: {
              products: []
            }
          }, {
            "new": true
          }));

        case 3:
          _wishlist4 = _context4.sent;

          if (_wishlist4) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Wishlist not found"
          }));

        case 6:
          res.status(200).json({
            message: "Wishlist cleared successfully",
            wishlist: _wishlist4
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Error clearing wishlist",
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var checklist = function checklist(req, res) {
  var _product2, _wishlist5, isInWishlist;

  return regeneratorRuntime.async(function checklist$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          try {
            _product2 = req.params.product;
            _wishlist5 = _wishlist5.findOne({
              user: req.user.id
            });
            isInWishlist = _wishlist5 ? _wishlist5.product.some(function (id) {
              return id.toString() === productId;
            }) : false;
            res.status(200).json({
              productId: productId,
              isInWishlist: isInWishlist
            });
          } catch (error) {
            res.status(500).json({
              message: "error chacking wishlist",
              error: error.message
            });
          }

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  getWishlist: getWishlist,
  addToWishlist: addToWishlist,
  removeFromWishlist: removeFromWishlist,
  clearWishlist: clearWishlist,
  checkWishlist: checkWishlist
};