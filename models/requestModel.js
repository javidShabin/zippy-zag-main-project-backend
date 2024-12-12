const mongoose = require("mongoose");

const sellerRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true, default: "Pending" },
});

const SellerRequest = mongoose.model("sellerRequest", sellerRequestSchema);

module.exports = { SellerRequest };
