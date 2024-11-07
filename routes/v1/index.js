const express = require("express");
const { userRouter } = require("./userRouter");

const router = express.Router();

router.use("/user", userRouter);

module.exports = { v1Router: router };
