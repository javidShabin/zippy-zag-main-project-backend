const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const {
  makePayment,
  getOrderStatus,
  updatePaymentStatus,
  updateOrderStatus,
  getOrdersByRestaurant,
} = require("../../controllers/paymentController");
const router = express.Router();

router.post("/create-checkout-session", userAuth, makePayment);
router.get("/session-status", userAuth, getOrderStatus);
router.put("/update-payment-status", updatePaymentStatus);
router.put("/update-order-status", updateOrderStatus);
router.get("/orderBy-restaurant/:restaurantId", getOrdersByRestaurant);

module.exports = { paymentRouter: router };
