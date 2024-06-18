const { cloudinaryInstance } = require("../config/cloudineryConfig");
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
    console.log(restautantId);
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
