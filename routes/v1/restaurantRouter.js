const express = require("express");
const { upload } = require("../../middlewares/multer");
const {
  getAllRestaurants,
  createRestaurant,
  updateRestautant,
  deleteRestaurant,
  getRestautantById,
} = require("../../controllers/restaurantController");

const router = express.Router();

router.get("/all-restaurants", getAllRestaurants);
router.get("/rest-details/:id", getRestautantById);
router.post("/create-restaurant", upload.single("image"), createRestaurant);
router.put("/update-restaurant/:id", updateRestautant);
router.delete("/delete-restaurant/:id", deleteRestaurant);

module.exports = { restaurantRouter: router };
