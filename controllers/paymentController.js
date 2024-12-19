const { Order } = require("../models/orderModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Backend: makePayment Controller
const makePayment = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.CLIENT_DOMAIN) {
      throw new Error(
        "Missing environment variables: STRIPE_SECRET_KEY or CLIENT_DOMAIN"
      );
    }

    const { products, userId, totalAmount, address, restaurantId } = req.body;

    console.log(restaurantId, "===details");

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

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
      success_url: `${process.env.CLIENT_DOMAIN}/user/payment/success`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/user/payment/cancel`,
    });

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      restaurantId,
      paymentStatus: "Pending",
      paymentSessionId: session.id,
      paymentMethod: "Stripe",
      address,
      createdAt: new Date(),
    });

    await newOrder.save();

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message || error);

    if (error.type === "StripeCardError") {
      return res
        .status(400)
        .json({ success: false, message: "Card was declined." });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware that attaches user to req.user

    // Fetch orders associated with the user
    const orders = await Order.find({ userId });

    console.log(orders);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    // Map through orders to retrieve relevant details
    const orderStatuses = orders.map((order) => ({
      orderStatus: order.orderStatus,
      orderId: order._id,
      restaurantId: order.restaurantId,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      address: order.address,
      products: order.products,
    }));

    res.json({ success: true, orders: orderStatuses });
  } catch (error) {
    console.error("Error fetching order status:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order status",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params; // Extract orderId from request parameters

    // Validate that orderId is provided
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    // Fetch the order by ID
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Return the order details
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order by ID:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    // Ensure orderId and paymentStatus are provided
    if (!orderId || !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "OrderId and paymentStatus are required.",
      });
    }

    // Fetch the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update the order's payment status
    order.paymentStatus = paymentStatus;

    // Save the updated order
    await order.save();

    res.json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment status",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    // Ensure orderId and orderStatus are provided
    if (!orderId || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: "OrderId and orderStatus are required.",
      });
    }

    // Fetch the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update the order's status
    order.orderStatus = orderStatus;

    // Save the updated order
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Ensure restaurantId is provided
    if (!restaurantId) {
      return res
        .status(400)
        .json({ success: false, message: "RestaurantId is required." });
    }

    console.log("Fetching orders for restaurantId:", restaurantId);

    // Fetch orders associated with the restaurantId
    const orders = await Order.find({ restaurantId });

    // If no orders are found
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this restaurant",
      });
    }

    // Send the list of orders
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders by restaurant:", error.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};


module.exports = {
  makePayment,
  getOrderStatus,
  getOrderById,
  updatePaymentStatus,
  updateOrderStatus,
  getOrdersByRestaurant,
};
