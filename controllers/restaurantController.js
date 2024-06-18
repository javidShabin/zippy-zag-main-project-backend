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
