const express = require("express");
const { registerAdmin } = require("../../controllers/adminController");

const router = express();

router.post("/register", registerAdmin);

module.exports = { adminRouter: router };
