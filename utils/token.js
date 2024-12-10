const jwt = require("jsonwebtoken");

// Generate User token
const generateUserToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role || "user",
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.log("Error generating user token:", error);
    return null; // Optional: return null to indicate failure
  }
};

// Generate Admin token
const generateAdminToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role || "admin",
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.log("Error generating admin token:", error);
    return null; // Optional: return null to indicate failure
  }
};

// Generate Seller token
const generateSellerToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role || "seller",
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.log("Error generating seller token:", error);
    return null; // Optional: return null to indicate failure
  }
};

module.exports = { generateUserToken, generateAdminToken, generateSellerToken };
