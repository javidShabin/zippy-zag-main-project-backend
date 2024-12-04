const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const { makePayment } = require("../../controllers/paymentController");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();



router.post("/create-checkout-session", userAuth, makePayment);

module.exports = { paymentRouter: router };
