const { Request } = require("../models/requestModel"); // Adjust path as necessary
const nodemailer = require("nodemailer");

// Controller to create a new request
const createRequest = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's data
    const { cuisine, email, location, ownerName, phone, restaurantName } =
      req.body;

    // Check if all required fields are provided
    if (
      !cuisine ||
      !email ||
      !location ||
      !ownerName ||
      !phone ||
      !restaurantName
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a request already exists for the same user or restaurant
    const existingRequest = await Request.findOne({
      $or: [{ userId }, { restaurantName }], // Check if the user or restaurant already has a request
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A request has already been sent.",
      });
    }

    // Create a new request instance
    const newRequest = new Request({
      userId, // Associate the request with the user
      cuisine,
      email,
      location,
      ownerName,
      phone,
      restaurantName,
    });

    console.log(newRequest, "===new");

    // Save the new request to the database
    const savedRequest = await newRequest.save();

    console.log(savedRequest, "===saved");

    return res.status(201).json({
      message: "Request sent successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
// Get all requests
const getAllRequests = async (req, res) => {
  try {
    // Fetch all requests from the database
    const requests = await Request.find();

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No requests found" });
    }

    return res.status(200).json({
      message: "Requests retrieved successfully",
      requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
// Get request by id
const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params; // Get the requestId from URL parameters

    // Find the request by its ID
    const request = await Request.findById(requestId);

    // If the request does not exist
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Return the found request
    return res.status(200).json({
      message: "Request fetched successfully",
      request,
    });
  } catch (error) {
    console.error("Error fetching request by ID:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
// Get request by user id
const getRequestsByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's data

    // Fetch requests by user ID
    const requests = await Request.find({ userId });

    if (!requests || requests.length === 0) {
      return res
        .status(404)
        .json({ message: "No requests found for this user" });
    }

    return res.status(200).json({
      message: "Requests retrieved successfully",
      requests,
    });
  } catch (error) {
    console.error("Error fetching requests by user ID:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
// Update request statuds
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body; // Assuming status is passed in the request body

    // Check if both requestId and status are provided
    if (!requestId || !status) {
      return res
        .status(400)
        .json({ message: "Request ID and status are required" });
    }

    // Find the request by its ID
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the status of the request
    request.status = status;

    // Save the updated request
    const updatedRequest = await request.save();

    return res.status(200).json({
      message: "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
// delete request
const deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // Assuming requestId is passed as a URL parameter

    // Check if requestId is provided
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Find and delete the request by its ID
    const deletedRequest = await Request.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({
      message: "Request deleted successfully",
      request: deletedRequest,
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Send join link to seller 
const sendJoinLink = async (req, res) => {
  const { email, restaurantId } = req.body; // Get email and restaurantId from the request body

  // Validate input
  if (!email || !restaurantId) {
    return res.status(400).json({ message: "Email and Restaurant ID are required" });
  }

  // Basic email validation using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify the transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
        return res.status(500).json({ message: "SMTP connection failed" });
      }
      console.log("SMTP transporter is ready to send emails.");
    });

    // Generate the join link (assuming you have a base URL and restaurant ID)
    const joinLink = process.env.THE_BASE_URL

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Join Link and Restaurant ID",
      text: `Hello,

Here is your join link: ${joinLink}
Restaurant ID: ${restaurantId}

Thank you!`,
    };

    // Send the restaurant ID and join link via email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.json({ message: "Join Link and Restaurant ID sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error); // Log the error for debugging
    res.status(500).json({ message: "Failed to send join link and restaurant ID. Please try again." });
  }
}

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  getRequestsByUserId,
  updateRequestStatus,
  deleteRequest,
  sendJoinLink
};
