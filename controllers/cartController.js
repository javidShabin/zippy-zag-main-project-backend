const { Cart } = require("../models/cartModel");

// add items in cart
const addItemToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items array is required and should not be empty.",
      });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Loop through items and add or update them in the cart
    for (let { menuItem, quantity } of items) {
      const itemIndex = cart.items.findIndex(
        (item) => item.menuItem.toString() === menuItem
      );

      const menuItemDetails = await Menu.findById(menuItem);
      if (!menuItemDetails) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      if (itemIndex > -1) {
        // Update quantity if item already exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          menuItem,
          quantity,
          image: menuItemDetails.image, // Include image here
        });
      }
    }

    let totalPrice = 0;
    for (let item of cart.items) {
      const menuItem = await Menu.findById(item.menuItem);
      console.log(menuItem, "check");
      if (menuItem) {
        totalPrice += menuItem.price * item.quantity;
        item.price = menuItem.price;
        item.ItemName = menuItem.name; // Ensure ItemName is assigned before saving
        item.image = menuItem.image; // Assign image if needed
        console.log(item.price, "===price");
      } else {
        throw new Error("Menu item not found");
      }
    }

    cart.totalPrice = totalPrice;

    // Save the cart with updated total price and ItemName for each item
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding item to cart.",
      error: error.message,
    });
  }
};
