const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const {
  addItemToCart,
  getCart,
  updateCart,
  removeFromCart,
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

module.exports = { cartRouter: router };
