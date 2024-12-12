const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const {
  addItemToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../../controllers/cartController");

const router = express.Router();

// Add item to cart
router.post("/addCart", userAuth, addItemToCart);
// Get cart
router.get("/getCart", userAuth, getCart);
// Update cart
router.put("/update", userAuth, updateCart);
// Remove cart
router.delete("/remove", userAuth, removeFromCart);
// CLear all item form cart
router.delete("/clear", userAuth, clearCart)

module.exports = { cartRouter: router };
