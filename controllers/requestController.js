const { Request } = require("../models/requestModel"); // Adjust path as necessary

// Controller to create a new request
const createRequest = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's data
    const { cuisine, email, location, ownerName, phone, restaurantName } = req.body;

    // Check if all required fields are provided
    if (!cuisine || !email || !location || !ownerName || !phone || !restaurantName) {
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


module.exports = { createRequest, getAllRequests, getRequestById, getRequestsByUserId };
