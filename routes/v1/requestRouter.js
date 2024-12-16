const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const { createRequest } = require("../../controllers/requestController");

const router = express();

router.post("/create-request", userAuth, createRequest);

module.exports = { requestRouter: router };
