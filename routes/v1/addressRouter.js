const express = require("express");
const {
  createAddress,
  updateAddress,
  getAddress,
  deleteAddress,
} = require("../../controllers/addressController");
const router = express.Router();

// Create address
router.post("/address", createAddress);
// Ppdate address
router.put("/address/:id", updateAddress);
// Get address
router.get("/address", getAddress);
// Delete address
router.delete("/address/:id", deleteAddress);

module.exports = { addressRouter: router };
