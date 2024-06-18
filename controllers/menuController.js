const { cloudinaryInstance } = require("../config/cloudineryConfig");
const { Menu } = require("../models/menuModel");

// Create a menu
const createMenuItem = async (req, res) => {
  try {
    // Get data from req.body
    const { restaurantId, name, ...rest } = req.body;
    // check if required fileds present
    if (!restaurantId || !name || Object.keys(rest).length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if have any same menu item
    const existMenuItem = await Menu.findOne({ restaurantId, name });
    if (existMenuItem) {
      return res.status(409).json({ message: "Item already exists" });
    }
    // add image file clodinery and get from cloudinery
    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
      console.log("Upload result:", uploadResult);
    } else {
      console.log("No file to upload.");
    }
    // Save menu data to database
    const newItem = new Menu({
      restaurantId,
      name,
      ...rest,
      image: uploadResult.secure_url || "",
    });
    const saveMenuItem = await newItem.save();
    res.status(201).json(saveMenuItem);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
