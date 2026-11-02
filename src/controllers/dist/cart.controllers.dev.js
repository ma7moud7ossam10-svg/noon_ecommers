"use strict";

var Cart = require("../models/cart.model");

var Product = require("../models/product.model"); // GET /cart


exports.getCart = function _callee(req, res) {
  var cart, items, total;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user.id
          }).populate("items.product"));

        case 3:
          cart = _context.sent;

          if (cart) {
            _context.next = 8;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(Cart.create({
            user: req.user.id,
            items: []
          }));

        case 7:
          cart = _context.sent;

        case 8:
          items = cart.items.map(function (item) {
            var product = item.product;
            return {
              product: product,
              quantity: item.quantity,
              subtotal: product ? product.price * item.quantity : 0
            };
          });
          total = items.reduce(function (sum, item) {
            return sum + item.subtotal;
          }, 0);
          res.status(200).json({
            message: "Cart retrieved successfully",
            cart: {
              _id: cart._id,
              items: items,
              total: total
            }
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Error getting cart",
            error: _context.t0.message
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // POST /cart/items


exports.addToCart = function _callee2(req, res) {
  var _req$body, productId, _req$body$quantity, quantity, product, cart, existingItem;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, productId = _req$body.productId, _req$body$quantity = _req$body.quantity, quantity = _req$body$quantity === void 0 ? 1 : _req$body$quantity;

          if (mongoose.isValidObjectId(productId)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid product ID"
          }));

        case 4:
          if (!(!Number.isInteger(quantity) || quantity < 1)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Quantity must be a positive integer"
          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 8:
          product = _context2.sent;

          if (product) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Product not found"
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user.id
          }));

        case 13:
          cart = _context2.sent;

          if (!cart) {
            cart = new Cart({
              user: req.user.id,
              items: []
            });
          }

          existingItem = cart.items.find(function (item) {
            return item.product.toString() === productId;
          });

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.items.push({
              product: productId,
              quantity: quantity
            });
          }

          _context2.next = 19;
          return regeneratorRuntime.awrap(cart.save());

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(cart.populate("items.product"));

        case 21:
          res.status(200).json({
            message: "Product added to cart successfully",
            cart: cart
          });
          _context2.next = 27;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Error adding product to cart",
            error: _context2.t0.message
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
}; // PUT /cart/items/:productId


exports.updateCartItem = function _callee3(req, res) {
  var productId, quantity, cart, item;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          productId = req.params.productId;
          quantity = req.body.quantity;

          if (mongoose.isValidObjectId(productId)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Invalid product ID"
          }));

        case 5:
          if (!(!Number.isInteger(quantity) || quantity < 1)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Quantity must be a positive integer"
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user.id
          }));

        case 9:
          cart = _context3.sent;

          if (cart) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Cart not found"
          }));

        case 12:
          item = cart.items.find(function (item) {
            return item.product.toString() === productId;
          });

          if (item) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Product not found in cart"
          }));

        case 15:
          item.quantity = quantity;
          _context3.next = 18;
          return regeneratorRuntime.awrap(cart.save());

        case 18:
          _context3.next = 20;
          return regeneratorRuntime.awrap(cart.populate("items.product"));

        case 20:
          res.status(200).json({
            message: "Cart item updated successfully",
            cart: cart
          });
          _context3.next = 26;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Error updating cart item",
            error: _context3.t0.message
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
}; // DELETE /cart/items/:productId


exports.removeFromCart = function _callee4(req, res) {
  var productId, cart, initialLength;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          productId = req.params.productId;

          if (mongoose.isValidObjectId(productId)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Invalid product ID"
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user.id
          }));

        case 6:
          cart = _context4.sent;

          if (cart) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Cart not found"
          }));

        case 9:
          initialLength = cart.items.length;
          cart.items = cart.items.filter(function (item) {
            return item.product.toString() !== productId;
          });

          if (!(cart.items.length === initialLength)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Product not found in cart"
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(cart.save());

        case 15:
          res.status(200).json({
            message: "Product removed from cart successfully",
            cart: cart
          });
          _context4.next = 21;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Error removing product from cart",
            error: _context4.t0.message
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // DELETE /cart


exports.clearCart = function _callee5(req, res) {
  var cart;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user.id
          }));

        case 3:
          cart = _context5.sent;

          if (cart) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Cart not found"
          }));

        case 6:
          cart.items = [];
          _context5.next = 9;
          return regeneratorRuntime.awrap(cart.save());

        case 9:
          res.status(200).json({
            message: "Cart cleared successfully",
            cart: cart
          });
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: "Error clearing cart",
            error: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};