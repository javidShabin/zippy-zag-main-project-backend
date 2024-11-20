const express = require("express");
const {
  createAddress,
  updateAddress,
  getAddress,
  deleteAddress,
} = require("../../controllers/addressController");
const { userAuth } = require("../../middlewares/userAuth");
const router = express.Router();

// Create address
router.post("/create-address", userAuth, createAddress);
// Ppdate address
router.put("/update-address/:id", userAuth, updateAddress);
// Get address
router.get("/get-address", userAuth, getAddress);
// Delete address
router.delete("/remove-address/:id", userAuth, deleteAddress);

module.exports = { addressRouter: router };
