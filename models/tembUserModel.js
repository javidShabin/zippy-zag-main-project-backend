const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_JlCFnIGX5omgjEjgV9F3sBRq14eTERK9w&s",
  },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

const TempUser = mongoose.model("tempUser", tempUserSchema);

module.exports = { TempUser };
