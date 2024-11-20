const express = require("express");
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  getSellersList,
  sellerProfile,
  forgotSellerPassword,
  editeSellerProfile,
  checkSeller,
} = require("../../controllers/sellerController");
const { adminAuth } = require("../../middlewares/adminAuth");
const { sellerAuth } = require("../../middlewares/sellerAuth");
const { upload } = require("../../middlewares/multer");
const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/logout", logoutSeller);
router.get("/allSellers", adminAuth, getSellersList);
router.get("/profile", sellerAuth, sellerProfile);
router.put("/forgot-password", sellerAuth, forgotSellerPassword);
router.put(
  "/update-profile",
  sellerAuth,
  upload.single("image"),
  editeSellerProfile
);
router.get("/check-seller", sellerAuth, checkSeller);

module.exports = { sellerRouter: router };
