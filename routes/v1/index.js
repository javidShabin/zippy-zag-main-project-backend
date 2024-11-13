const express = require("express");
const { userRouter } = require("./userRouter");
const { adminRouter } = require("./adminRouter");
const { restaurantRouter } = require("./restaurantRouter");
const { menuRouter } = require("./menuRouter");
const { sellerRouter } = require("./selleRouter");

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter)
router.use("/restaurant", restaurantRouter);
router.use("menu", menuRouter);

module.exports = { v1Router: router };
