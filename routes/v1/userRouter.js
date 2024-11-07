const express = require("express");
const {
  userRegistration,
  verifyOtpAndCreateUser,
  userLogin,
  forgotPassword,
  getAllUsers,
  userLogOut,
  userProfile,
  updateUserProfile,
  deleteUser,
  checkUser,
} = require("../../controllers/userController");
const { userAuth } = require("../../middlewares/userAuth");
const { upload } = require("../../middlewares/multer");
const router = express.Router();

router.post("/register", userRegistration);
router.post("/otpVerify", verifyOtpAndCreateUser);
router.post("/login", userLogin);
router.put("/forget-password", forgotPassword);
router.get("/users-list", getAllUsers);
router.post("/logout", userLogOut);
router.get("/user-profile", userAuth, userProfile);
router.put(
  "/update-profile",
  userAuth,
  upload.single("image"),
  updateUserProfile
);
router.delete("/remove-user/:id", deleteUser);
router.get("/check-user", userAuth, checkUser);

module.exports = { userRouter: router };
