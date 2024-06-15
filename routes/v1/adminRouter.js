const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  adminProfile,
  forgotAdminPassword,
  editeAdminProfile,
  checkAdmin,
} = require("../../controllers/adminController");
const { adminAuth } = require("../../middlewares/adminAuth");
const { upload } = require("../../middlewares/multer");

const router = express();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", adminAuth, logoutAdmin);
router.get("/profile", adminAuth, adminProfile);
router.put("/forgot-password", adminAuth, forgotAdminPassword);
router.put(
  "/update-profile",
  adminAuth,
  upload.single("image"),
  editeAdminProfile
);
router.get("/check-admin", adminAuth, checkAdmin);

module.exports = { adminRouter: router };
