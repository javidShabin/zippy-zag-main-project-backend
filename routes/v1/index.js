const express = require("express");
const { userRouter } = require("./userRouter");
const { adminRouter } = require("./adminRouter");

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter)

module.exports = { v1Router: router };
