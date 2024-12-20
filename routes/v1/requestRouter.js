const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const {
  createRequest,
  getAllRequests,
  getRequestById,
  getRequestsByUserId,
  updateRequestStatus,
  deleteRequest,
  sendJoinLink,
} = require("../../controllers/requestController");

const router = express();

router.post("/create-request", userAuth, createRequest);
router.get("/getAllRequest", getAllRequests);
router.get("/getRequestById/:requestId", getRequestById);
router.get("/getRequestByUserId", userAuth, getRequestsByUserId);
router.put("/update/status", updateRequestStatus);
router.delete("/delete/:requestId", deleteRequest);
router.post("/send-join-link", sendJoinLink);

module.exports = { requestRouter: router };
