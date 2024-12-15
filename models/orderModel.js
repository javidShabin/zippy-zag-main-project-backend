const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // Assuming you have a Restaurant model
      required: true,
    },
    products: [
      {
        ItemName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    paymentSessionId: { type: String, required: true },
    paymentMethod: { type: String, enum: ["Stripe"], required: true },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"], // Define possible statuses
      default: "Processing", // Default status when order is created
    },
    createdAt: { type: Date, default: Date.now },
    address: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Create the Order model based on the schema
const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
