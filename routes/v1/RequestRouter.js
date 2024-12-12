const { createRequest } = require("../../controllers/sellerRequestController");

const { userAuth } = require("../../middlewares/userAuth");
const router = express.Router();

router.post("/send-request", userAuth, createRequest);

module.exports = { requestRouter: router };
