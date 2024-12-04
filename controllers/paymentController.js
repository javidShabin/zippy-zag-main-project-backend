const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const client_domain = process.env.CLIENT_DOMAIN;

const makePayment = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.CLIENT_DOMAIN) {
      throw new Error(
        "Missing environment variables: STRIPE_SECRET_KEY or CLIENT_DOMAIN"
      );
    }

    const { products } = req.body;

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

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.ItemName,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${client_domain}/user/payment/success`,
      cancel_url: `${client_domain}/user/payment/cancel`,
    });

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message || error);

    if (error.type === "StripeCardError") {
      return res.status(400).json({
        success: false,
        message: "Card was declined.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

module.exports = {
  makePayment,
};
