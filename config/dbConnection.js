const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Database Connected...!");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

module.exports = { dbConnection };
