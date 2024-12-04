const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const client_domain = process.env.CLIENT_DOMAIN;
const makePayment = async () => {
  try {
    const { products } = req.body;
console.log(products)
    // Ensure products array exists and has items
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products provided" });
    }

    // Map the products into Stripe line items
    const lineItems = products.map((product) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.ItemName, // Use ItemName for product name
            images: [product.image], // Ensure this is a valid URL
          },
          unit_amount: Math.round(product.price * 100), // Convert to smallest currency unit (e.g., paise)
        },
        quantity: product.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${client_domain}/user/payment/success`,
      cancel_url: `${client_domain}/user/payment/cancel`,
    });

    // Log session for debugging
    console.log("Checkout Session created:", session);

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

module.exports = {
  makePayment,
};
