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
  } catch (error) {}
};
// Logout admin
const logoutAdmin = async (req, res) => {
  try {
  } catch (error) {}
};
// Admin profile
const adminProfile = async (req, res) => {
  try {
  } catch (error) {}
};
// Forget password
const forgotAdminPassword = async (req, res) => {
  try {
  } catch (error) {}
};
// Edite profile
const editeAdminProfile = async (req, res) => {
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
