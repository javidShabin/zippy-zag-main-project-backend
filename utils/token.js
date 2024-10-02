const jwt = require("jsonwebtoken");

// Generate USer toke
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
    console.log(error);
  }
};
// Generate Admin toke
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
    console.log(error);
  }
};
// Generate Seller toke
const generateSellerToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role,
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateUserToken, generateAdminToken, generateSellerToken };
