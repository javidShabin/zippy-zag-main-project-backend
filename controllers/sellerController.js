const { Restaurant } = require("../models/restaurantModel");
const { Seller } = require("../models/sellerModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

// Seller registration
const registerSeller = async (req, res) => {
  try {
    // Destructure data from the request body
    const { email, password, restaurantId, ...rest } = req.body;

    // Validate input (can integrate Joi or express-validator here for cleaner validation)
    if (!email || !password || !restaurantId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // Hash the seller's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new seller and save it to the database
    const newSeller = new Seller({
      email,
      password: hashedPassword,
      restaurant: restaurantId,
      ...rest,
    });
    await newSeller.save();

    // Generate a token
    const token = generateToken({
      _id: newSeller.id,
      email: newSeller.email,
      role: "seller",
    });

    // Pass the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production", // Default to secure in production
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
    });
  } catch (error) {
    console.error("Error registering seller:", error.message); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login seller
const loginSeller = async (req, res) => {
  try {
    // Destructuring fields
    const { email, password } = req.body;

    // Check if required fields
    if ((!email, !password)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // check the user signed or not
    const isSellerExist = await Seller.findOne({ email });
    if (!isSellerExist) {
      return res
        .status(401)
        .json({ success: false, message: "Seller does not exist" });
    }

    // generate token
    const token = generateToken(isSellerExist._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "development" ? false : true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    // Pass the token as cookie
    res.status(201).json({ success: true, message: "Seller logged in" });
  } catch (error) {
    res.status(404).json({ message: "faild to seller login" });
  }
};
// Seller logout
const logoutSeller = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Seller logged out" });
  } catch (error) {
    res.json({ error });
  }
};
// get all sellers
const getSellersList = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    return res.status(200).json(sellers);
  } catch (error) {
    res.status(404).json({ message: "Server not responese..." });
  }
};
// Seller profile
const sellerProfile = async (req, res) => {
  try {
    // Get seller from request
    const { seller } = req;
    // Get needed admin data
    const sellerData = await Seller.findOne({ _id: seller.id });
    const { image, name, email, phone, _id } = sellerData;
    // Send the data json response
    res.json({
      success: true,
      message: "Seller profile",
      image,
      name,
      email,
      phone,
      _id,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
// Forgot password
const forgotSellerPassword = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;
    // Check if present the email
    if (!email || !password) {
      return res.status(401).json({ message: "Fileds are required" });
    }
    const isSellerExist = await Seller.findOne({ email });
    if (!isSellerExist) {
      return res.status(401).json({ message: "The seller not not found" });
    }
    // Hash the new password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update the seller's password
    isSellerExist.password = hashedPassword;
    // Save the updated user data
    await isSellerExist.save();
    return res.status(200).json({
      message: "Password has been updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while updating password", error: error.message });
  }
};
// Edite profile
const editeSellerProfile = async (req, res) => {
  try {
    // Get seller from request
    const { seller } = req;
    // Get datas from req.body
    const { name, email, phone } = req.body;
    // Store update in a variable
    const updateData = { name, email, phone };
    // Declare a variable
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
    // Update seller
    const updatedSeller = await Seller.findByIdAndUpdate(
      seller.id,
      updateData,
      {
        new: true,
      }
    );
    // Check have any updated seller
    if (!updatedSeller) {
      return res
        .status(404)
        .json({ success: false, message: "seller not found" });
    }
    // Send response
    res.json({
      success: true,
      message: "Seller profile updated successfully",
      data: updatedSeller,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
const checkSeller = async (req, res) => {
  try {
    // Get seller from req.seller
    const seller = req.seller
    // Check seller authorzed or not
    if (!seller) {
      return res
        .status(401)
        .json({ success: false, message: "seller not autherised" });
    }
    // If seller authorized
    res.json({ success: true, message: "seller autherised" });
  } catch (error) {
    res.status(401).json(error);
  }
}

module.exports = {
  registerSeller,
  loginSeller,
  logoutSeller,
  getSellersList,
  sellerProfile,
  forgotSellerPassword,
  editeSellerProfile,
  checkSeller
};
