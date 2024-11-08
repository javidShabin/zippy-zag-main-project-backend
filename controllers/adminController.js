const { Admin } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

// Register admin
const registerAdmin = async (req, res) => {
  try {
    // Get datas from req.body
    const { email, password, conformPassword, ...rest } = req.body;
    // Check if rerquired fields are present
    if (!email || !password || !conformPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if password and confirm password match
    if (password !== conformPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // Check if the admin already exists
    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(409).json({ message: "User already exists" });
    }
    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new admin and save the to databse
    const newAdmin = new Admin({ email, ...rest, password: hashedPassword });
    await newAdmin.save();

    // Generate a token
    const token = generateToken({
      _id: newAdmin._id,
      email: newAdmin.email,
      role: "customer",
    });
    // Pass the token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      maxAge: 3600000, // 1 hour
    });
    // Return a success response
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "User creation failed", error: error.message });
  }
};
// Login admin
const loginAdmin = async (req, res) => {
  try {
    // Get values from req.body
    const { name, email, password } = req.body;
    // Check if required field are present
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // Check the admin logined or not
    const isAdminExist = await Admin.findOne({ email });
    if (!isAdminExist) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }
    // Compare password for login
    const passwordMatch = bcrypt.compareSync(password, isAdminExist.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Unatherised access" });
    }
    // Generate token
    const token = generateToken(isAdminExist._id);
    // Pass token as cookie the token will expire in one hour
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });
    res.status(201).json({ success: true, message: "Admin logged in" });
  } catch (error) {
    res.status(404).json({ message: "faild to admin login" });
  }
};
// Logout admin
const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });
    res.json({ success: true, message: "admin logged out" });
  } catch (error) {
    res.status(404).json({ message: "faild to user logout" });
  }
};
// Admin profile
const adminProfile = async (req, res) => {
  try {
    // Get admin from request
    const { admin } = req;
    // Get needed admin data
    const adminData = await Admin.findOne({ _id: admin.id });
    const { image, name, email, phone, _id } = adminData;
    // Send the data as json response
    res.json({
      success: true,
      message: "Admin profile",
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
// Forget password
const forgotAdminPassword = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;
    // Check if present the email
    if (!email || !password) {
      return res.status(401).json({ message: "Fileds are required" });
    }
    // Check the admin exist or not
    const isAdminExist = await User.findOne({ email });
    if (!isAdminExist) {
      return res.status(401).json({ message: "The admin not not found" });
    }
    // Hash the new password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update the admin's password
    isAdminExist.password = hashedPassword;
    // Save the updated user data
    await isAdminExist.save();
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
const editeAdminProfile = async (req, res) => {
  try {
  } catch (error) {}
};
// Check admin
const checkAdmin = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  adminProfile,
  forgotAdminPassword,
  editeAdminProfile,
};
