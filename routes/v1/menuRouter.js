const express = require("express");
const { upload } = require("../../middlewares/multer");
const {
  createMenuItem,
  getMenuforRestaurant,
  getMenusByCategory,
  searchMenuByName,
  filterMenusByPrice,
  updateMenu,
  deleteMenu,
} = require("../../controllers/menuController");

const router = express.Router();

// Create menu
router.post("/create-menu", upload.single("image"), createMenuItem);
// Get menus by restaurant id
router.get("/menu/:restaurantId", getMenuforRestaurant);
// Get menu by gategory
router.get("/:restaurantId/category/:category", getMenusByCategory);
// Search menu by name
router.get("/menu/:restaurantId/search", searchMenuByName);
// Filter menu bt price
router.get("/menu/:restaurantId/filter/price", filterMenusByPrice);
// Update menu
router.put("/update-menu/:menuId", updateMenu);
// delete menu
router.delete("/remove-menu/:meuId", deleteMenu);

module.exports = { menuRouter: router };
