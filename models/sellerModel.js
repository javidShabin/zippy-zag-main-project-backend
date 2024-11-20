const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant", // Reference to the Restaurant model
    required: true,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_JlCFnIGX5omgjEjgV9F3sBRq14eTERK9w&s",
  },
});

const Seller = mongoose.model("seller", sellerSchema);

module.exports = { Seller };
