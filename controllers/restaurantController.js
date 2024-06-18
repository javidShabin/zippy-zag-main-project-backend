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
