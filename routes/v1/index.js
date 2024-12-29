const express = require("express");
const { userRouter } = require("./userRouter");
const { adminRouter } = require("./adminRouter");
const { restaurantRouter } = require("./restaurantRouter");
const { menuRouter } = require("./menuRouter");
const { sellerRouter } = require("./selleRouter");
const { cartRouter } = require("./cartRouters");
const { addressRouter } = require("./addressRouter");
const { paymentRouter } = require("./paymentRouter");
const { requestRouter } = require("./requestRouter");
const { chatRouter } = require("./chatRouter");

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter);
router.use("/restaurant", restaurantRouter);
router.use("/menu", menuRouter);
router.use("/cart", cartRouter);
router.use("/address", addressRouter);
router.use("/payment", paymentRouter);
router.use("/request", requestRouter);
router.use("/chat", chatRouter);
module.exports = { v1Router: router };
