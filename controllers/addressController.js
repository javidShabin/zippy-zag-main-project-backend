const { Address } = require("../models/addressModel");

// create address
const createAddress = async (req, res) => {
  try {
    const { name, email, street, city, postalCode, country, phone } = req.body;
    const user = req.user.id;
    if (!name || !street || !city || !postalCode || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const address = new Address({
      name,
      email,
      street,
      city,
      postalCode,
      phone,
      country,
      user: user,
    });
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// update address
const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updatedData = req.body;
    const address = await Address.findByIdAndUpdate(addressId, updatedData, {
      new: true,
    });
    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get address
const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user: userId });
    res.status(200).json(addresses);
  } catch (error) {}
};
// delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    await Address.findByIdAndDelete(userId);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAddress,
  updateAddress,
  getAddress,
  deleteAddress,
};
