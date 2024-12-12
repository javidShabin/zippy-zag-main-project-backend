const {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequst,
  removeRequest,
} = require("../../controllers/sellerRequestController");
const { adminAuth } = require("../../middlewares/adminAuth");
const { userAuth } = require("../../middlewares/userAuth");

const router = express.Router();

router.post("/send-request", userAuth, createRequest);
router.get("/all-requests", adminAuth, getAllRequests);
router.get("/get-request/:id", getRequestById);
router.put("/update-request", updateRequst);
router.delete("/delete-request", removeRequest);

module.exports = { requestRouter: router };
