const { Restaurant } = require("../models/restaurantModel");
const { Seller } = require("../models/sellerModel");

// Seller registration
const registerSeller = async (req, res) => {
  try {
    // Destructur data from request body
    const { email, ...rest } = req.body;
    // get restaurant id
    const restaurantId = rest.restaurantId;
    // Find restuarant by id and check have any restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    // Check exist seller or not
    const isExistSeller = await Seller.findOne({ email });
    if (isExistSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }
    // Hashing seller password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(rest.password, saltRounds);

    // Create a seller and save to database
    const newSeller = new Seller({
      email,
      ...rest,
      password: hashedPassword,
      restaurant: restaurantId,
    });
    await newSeller.save();
    // genetare token
    const token = generateToken({
      _id: newSeller.id,
      email: newSeller.email,
      role: "seller",
    });
    // pass the token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "development" ? false : true,
    });
    res.status(201).json({ success: true, message: "create new seller" });
  } catch (error) {
    res.status(404).json({ error });
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
