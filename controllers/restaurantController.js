const { cloudinaryInstance } = require("../config/cloudineryConfig");
const { Menu } = require("../models/menuModel");
const { Restaurant } = require("../models/restaurantModel");

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    // Find the restaurant
    const restaurants = await Restaurant.find({});
    res
      .status(200)
      .json({ success: true, message: "Find the resuataurants", restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a single restaurant by ID
const getRestautantById = async (req, res) => {
  try {
    const restautantId = req.params.id;

    const restaurant = await Restaurant.findById(restautantId);
    // Check the resstauratn available in the id
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Filter the restaurant by menu
const getRestaurantByMenu = async (req, res) => {
  try {
    // Extract the menu item name from the route parameter
    const { name } = req.params;

    // If the menu item name is not provided, return a 400 error response
    if (!name) {
      return res.status(400).json({ message: "Menu item name is required" });
    }

    // Perform a case-insensitive search for the menu item name in the database
    // Using regex to match menu items even with varying cases (e.g., 'Biriyani', 'biriyani')
    const menus = await Menu.find({
      name: { $regex: name, $options: "i" },
    }).populate("restaurantId"); // Populating the restaurantId field to get complete restaurant details
  

    // If no matching menus are found, return a 404 error response
    if (menus.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found for the given menu item" });
    }

    // Extract unique restaurants from the populated menus using a Set to remove duplicates
    // This will return only the unique restaurant details
    const uniqueRestaurants = [
      ...new Set(menus.map((menu) => menu.restaurantId)),
    ];

    // Return a 200 response with the unique restaurants found
    res.status(200).json({ restaurants: uniqueRestaurants });
  } catch (error) {
    // In case of any error, log the error and return a 500 server error response
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    // Destructure datas from req.body
    const { name, ...rest } = req.body;
    // check if required fileds present
    if (!name || Object.keys(rest).length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if a restaurent with same name
    const existRestaurant = await Restaurant.findOne({ name });
    if (existRestaurant) {
      return res.status(409).json({ message: "Restaurant already exists" });
    }

    let uploadResult;

    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
      console.log("Upload result");
    } else {
      console.log("No file to upload.");
    }
    // Save restaurant data to database
    const restaurant = new Restaurant({
      name,
      ...rest,
      image: uploadResult.secure_url || "",
    });
    const savedRestaurant = await restaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update restaurant
const updateRestautant = async (req, res) => {
  try {
    // Get resuarant id
    const restaurantId = req.params.id;
    // Get datas from req.body
    const { rating, name, location, cuisine, isOpen } = req.body;
    // Store update data in a variable
    const updateData = { rating, name, location, cuisine, isOpen };
    // Declare a emty variable
    let uploadResult;
    // Add image file and update the image
    if (req.file) {
      try {
        uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
        // Assign the uploaded image URL to the user's image field
        updateData.image = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message,
        });
      }
    }
    // Update restaurant
    const updateRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updateData,
      {
        new: true,
      }
    );
    if (!updateRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    // Send response
    res.json({
      success: true,
      message: "Update restaurant successfully",
      data: updateRestaurant,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error updateing profile",
      error: error.message,
    });
  }
};
// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    // Get id from request params
    const restaurantId = req.params.id;

    // Find and delete restaurant using the id
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting restaurant",
      error: error.message,
    });
  }
};
module.exports = {
  getAllRestaurants,
  getRestautantById,
  getRestaurantByMenu,
  createRestaurant,
  updateRestautant,
  deleteRestaurant,
};
