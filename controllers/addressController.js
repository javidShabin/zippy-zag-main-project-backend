const { Address } = require("../models/addressModel");

// create address
const createAddress = async (req, res) => {
  try {
    const { name, email, street, city, postalCode, country, phone } = req.body;
    console.log(name, email);
    const userId = req.user.id;
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
      user: userId,
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
    console.log(userId);
    const addresses = await Address.find({ user: userId });
    res.status(200).json(addresses);
  } catch (error) {}
};
