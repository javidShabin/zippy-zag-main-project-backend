const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    // Get token from cookies
    const { token } = req.cookies;
    // Check have any token
    if (!token) {
      return res
        .status(401)
        .json({ success: false, messgae: "User not authorized" });
    }
    // If have toke verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifyToken) {
      return res
        .status(401)
        .json({ success: false, messgae: "User not authorized" });
    }
    // After token verifying send the token as a object
    req.user = verifyToken;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "faild", error });
  }
};
module.exports = { userAuth };
