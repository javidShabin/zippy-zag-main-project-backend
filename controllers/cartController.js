const { Menu } = require("../models/menuModel");
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

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Initialize a new cart if it doesn't exist
      cart = new Cart({ user: userId, items: [] });
    }

    // Loop through items and add them to the cart
    for (let { menuItem, quantity } of items) {
      const menuItemDetails = await Menu.findById(menuItem);

      if (!menuItemDetails) {
        return res.status(404).json({
          message: `Menu item with ID ${menuItem} not found.`,
        });
      }

      const restaurantId = menuItemDetails.restaurantId;

      // If the cart does not already have a restaurantId, set it (it should be the same for all items)
      if (!cart.restaurantId) {
        cart.restaurantId = restaurantId;
      }

      // Check if the item already exists in the cart
      const itemExists = cart.items.some((item) => item.menuItem.toString() === menuItem);
      if (itemExists) {
        return res.status(400).json({
          message: "Item already in the cart.",
        });
      }

      // Add item to the cart
      cart.items.push({
        menuItem,
        quantity,
        image: menuItemDetails.image,
        price: menuItemDetails.price,
        ItemName: menuItemDetails.name,
      });
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding items to the cart.",
      error: error.message,
    });
  }
};
// get cart
const getCart = async (req, res) => {
  try {
    const user = req.user.id;

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while fetching the cart.",
      error: error.message,
    });
  }
};
// Update cart
const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items array is required and should not be empty.",
      });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    // Loop through the items and update the quantity or other properties
    for (let { menuItem, quantity } of items) {
      const itemIndex = cart.items.findIndex(
        (item) => item.menuItem.toString() === menuItem
      );

      if (itemIndex > -1) {
        // If item exists, update the quantity
        cart.items[itemIndex].quantity = quantity;

        // Optional: If the quantity is 0 or less, remove the item from the cart
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      } else {
        return res.status(404).json({
          message: `Menu item with ID ${menuItem} not found in the cart.`,
        });
      }
    }

    // Recalculate the total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const menuItemDetails = await Menu.findById(item.menuItem);
      if (menuItemDetails) {
        totalPrice += menuItemDetails.price * item.quantity;
      } else {
        return res.status(404).json({
          message: "One or more menu items were not found.",
        });
      }
    }

    cart.totalPrice = totalPrice;

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the cart.",
      error: error.message,
    });
  }
};
// remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { menuItem } = req.body;
    const userId = req.user.id;

    if (!menuItem) {
      return res.status(400).json({
        message: "menu item is required.",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItem
    );

    // recalculate total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const menuItemDetails = await Menu.findById(item.menuItem);
      if (menuItemDetails) {
        totalPrice += menuItemDetails.price * item.quantity;
      }
    }

    cart.totalPrice = totalPrice;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while removing item from cart.",
      error: error.message,
    });
  }
};
// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    // Clear the items and reset total price
    cart.items = [];
    cart.totalPrice = 0;

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully.",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while clearing the cart.",
      error: error.message,
    });
  }
};
module.exports = {
  addItemToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart
};
