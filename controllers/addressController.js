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
