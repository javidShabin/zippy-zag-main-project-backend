const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    // Get token from cookies
    const { adminToken } = req.cookies;

    // Check if have the cookie
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "admin not autherized",
      });
    }
    // Token verification
    const verifyToken = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);
    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "admin not autherized",
      });
    }
    // If have token send the token as a object
    req.admin = verifyToken;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "faild",
    });
  }
};
module.exports = { adminAuth };
