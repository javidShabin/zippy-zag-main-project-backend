const jwt = require("jsonwebtoken");

const generateToken = ({ _id, email, role }) => {
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

module.exports = { generateToken };
