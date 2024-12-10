const { Admin } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { generateAdminToken } = require("../utils/token");

// Register admin
// Register admin
const registerAdmin = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password, confirmPassword, ...rest } = req.body;

    // Check if required fields are present
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the admin already exists
    const isAdminExist = await Admin.findOne({ email });
    if (isAdminExist) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new admin and save it to the database
    const newAdmin = new Admin({ email, ...rest, password: hashedPassword });
    await newAdmin.save();

    // Generate a token
    const token = generateAdminToken({
      _id: newAdmin._id,
      email: newAdmin.email,
      role: "admin",
    });

    // Pass the token as a cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
      .json({ message: "Admin creation failed", error: error.message });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    // Get values from req.body
    const { email, password } = req.body;

    // Check if required fields are present
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Check if the admin exists
    const isAdminExist = await Admin.findOne({ email });
    if (!isAdminExist) {
      return res
        .status(401)
        .json({ success: false, message: "Admin does not exist" });
    }

    // Compare password for login
    const passwordMatch = bcrypt.compareSync(password, isAdminExist.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    // Generate token
    const token = generateAdminToken({
      _id: isAdminExist._id,
      email: isAdminExist.email,
      role: "admin",
    });

    // Pass token as a cookie, token will expire in one hour
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Admin logged in successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Failed to log in admin" });
  }
};

// Logout admin
const logoutAdmin = async (req, res) => {
  try {
    // Clear the admin token cookie
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ success: false, message: "Failed to log out admin" });
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
    const isAdminExist = await Admin.findOne({ email });
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
    // Get admin from request
    const { admin } = req;
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
    // Update admin
    const updateAdmin = await Admin.findByIdAndUpdate(admin.id, updateData, {
      new: true,
    });
    // Check have any updated admin
    if (!updateAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "admin not found" });
    }
    // Send response
    res.json({
      success: true,
      message: "Admin profile updated successfully",
      data: updateAdmin,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
// Check admin
const checkAdmin = async (req, res) => {
  try {
    // Get admin from req.admin
    const admin = req.admin;

    // Check if admin is authorized
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not authorized" });
    }

    // If admin is authorized
    res.status(200).json({ success: true, message: "Admin authorized" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while verifying admin",
      });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  adminProfile,
  forgotAdminPassword,
  editeAdminProfile,
  checkAdmin,
};
