const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { TempUser } = require("../models/tembUser");
const { cloudinaryInstance } = require("../config/cloudinaryConfig");
const { generateToken } = require("../utils/token");

// Register user
const userRegistration = async (req, res) => {
  try {
    const { email, password, conformPassword, name, phone, ...rest } = req.body;

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
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${otp}. Please verify to complete your registration.`,
    };

    await transporter.sendMail(mailOptions);

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save or update temporary user data with OTP
    await TempUser.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword,
        otp, // store OTP
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
        name, // Store name
        phone, // Store phone
      },
      { upsert: true, new: true } // Create new or update existing
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify within 10 minutes.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};
