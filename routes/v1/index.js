const express = require("express");
const { userRouter } = require("./userRouter");
const { adminRouter } = require("./adminRouter");
const { restaurantRouter } = require("./restaurantRouter");

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/restaurant", restaurantRouter);

module.exports = { v1Router: router };
