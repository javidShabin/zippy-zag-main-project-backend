const { Order } = require("../models/orderModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req, res) => {
  try {
    // Check for missing environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.CLIENT_DOMAIN) {
      throw new Error(
        "Missing environment variables: STRIPE_SECRET_KEY or CLIENT_DOMAIN"
      );
    }
    // Extract data from the request body
    const { products, userId, totalAmount, address } = req.body;

    // Validate if address is provided
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    // Check if the products array is provided and contains valid product data
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products provided" });
    }

    if (
      !products.every(
        (product) =>
          product.ItemName && product.price && product.quantity && product.image
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data. Ensure all fields are provided.",
      });
    }

    // Create line items for the Stripe checkout session
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.ItemName,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100), // Convert price to cents
      },
      quantity: product.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_DOMAIN}/user/payment/success`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/user/payment/cancel`,
    });

    // Create a new order in the database
    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentStatus: "Pending",
      paymentSessionId: session.id,
      paymentMethod: "Stripe",
      address,
      createdAt: new Date(),
    });

    await newOrder.save();

    // Respond with the session ID for Stripe checkout
    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message || error);

    // Handle Stripe card errors
    if (error.type === "StripeCardError") {
      return res
        .status(400)
        .json({ success: false, message: "Card was declined." });
    }

    // Generic error handling
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

module.exports = {
  makePayment,
};
