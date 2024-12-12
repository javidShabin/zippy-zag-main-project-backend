const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const { createRequest } = require("../../controllers/requestController");

const router = express.Router();

router.post("/send-request", userAuth, createRequest);

module.exports = { requestRouter: router };
