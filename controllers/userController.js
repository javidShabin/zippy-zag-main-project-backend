const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { TempUser } = require("../models/tembUserModel");
const { cloudinaryInstance } = require("../config/cloudineryConfig");
const { generateUserToken } = require("../utils/token");

// Register user
const userRegistration = async (req, res) => {
  try {
    const { email, password, conformPassword, name, phone } = req.body;

    // Check if required fields are present
    if (!email || !password || !conformPassword || !name || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== conformPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Ensure this is set in your environment variables
        pass: process.env.EMAIL_PASSWORD, // Ensure this is set in your environment variables
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${otp}. Please verify to complete your registration.`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ message: "Failed to send OTP. Try again later." });
    }

    // Hash the password
    const saltRounds = 10;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).json({ message: "Failed to process password. Try again later." });
    }

    // Save or update temporary user data with OTP
    try {
      await TempUser.findOneAndUpdate(
        { email },
        {
          email,
          password: hashedPassword,
          otp,
          otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
          name,
          phone,
        },
        { upsert: true, new: true }
      );
    } catch (dbError) {
      console.error("Error saving to TempUser:", dbError);
      return res.status(500).json({ message: "Failed to save user data. Try again later." });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify within 10 minutes.",
    });
  } catch (error) {
    console.error("Unexpected error in userRegistration:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Otp verifying and create user
const verifyOtpAndCreateUser = async (req, res) => {
  try {
    // Get emial and otp from req.body
    const { email, otp } = req.body;

    // Check if required fields are present
    if (!email || !otp) {
      return res.status(404).json({ message: "Email and OTP are required" });
    }
    // Find the temporary user by email
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if OTP is correct and not expired
    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (tempUser.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    // Create the actual user
    const newUser = new User({
      name: tempUser.name,
      phone: tempUser.phone,
      email: tempUser.email,
      password: tempUser.password,
    });

    await newUser.save();

    // Generate a token
    const token = generateUserToken({
      _id: newUser._id,
      email: newUser.email,
      role: "user",
    });
    // Set token as cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Remove the temporary user from the database after successful registration
    await TempUser.deleteOne({ email });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};
// Login user
const userLogin = async (req, res) => {
  try {
    // Get datas from req.body
    const { name, email, password } = req.body;
    // Check if required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Find the user using email
    const isUserExist = await User.findOne({ email });
    console.log(isUserExist);
    // If user not exist the response error
    if (!isUserExist) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the password of user
    const passwordMatch = bcrypt.compareSync(password, isUserExist.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Unatherised access" });
    }

    // Generate token
    const token = generateUserToken(isUserExist._id);
    // Pass token as cookie the token will expire in one hour
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({ success: true, message: "User logged in" });
  } catch (error) {
    res.status(404).json({ message: "faild to user login" });
  }
};
// Useres list
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: "Server not responese..." });
  }
};
// Logout user
const userLogOut = async (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during logout" });
  }
};

// Get user profile
const userProfile = async (req, res) => {
  try {
    // Get user from request
    const { user } = req;
    // Get needed user data
    const userData = await User.findOne({ _id: user.id });
    const { image, name, email, phone, _id } = userData;

    // Send the data as json response
    res.json({
      success: true,
      message: "User profile",
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
// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Get user from request
    const { user } = req;
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
    // Updated user
    const updatedUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
    });
    // Check have any updated user
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Send response
    res.json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
// Forget password
const forgotPassword = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;
    // Check if present the email
    if (!email || !password) {
      return res.status(401).json({ message: "Fileds are required" });
    }
    // Check the user exist or not
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res.status(401).json({ message: "The user not not found" });
    }
    // Hash the new password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Update the user's password
    isUserExist.password = hashedPassword;
    // Save the updated user data
    await isUserExist.save();
    return res.status(200).json({
      message: "Password has been updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while updating password", error: error.message });
  }
};
// Delete user
const deleteUser = async (req, res) => {
  try {
    // Extrat user id form request params
    const { id } = req.params;
    // Use findByIdAndDelete to remove the user
    const deleteUser = await User.findByIdAndDelete(id);
    // If user not found, return an error
    if (!deleteUser) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
// Check user
const checkUser = async (req, res) => {
  try {
    // Get user from req.user
    const user = req.user;
    // Check user authorizes or not
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user not autherised" });
    }
    // If user authorized
    res.json({ success: true, message: "user autherised" });
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = {
  userRegistration,
  verifyOtpAndCreateUser,
  userLogin,
  getAllUsers,
  userLogOut,
  userProfile,
  updateUserProfile,
  forgotPassword,
  deleteUser,
  checkUser,
};
