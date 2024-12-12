
const createRequest = async (req, res) => {
  try {
    const { name, location, cuisine, email, phone } = req.body;

    // Ensure the user ID is provided from the authenticated user
    const userId = req.user?.id; // Assuming req.user is populated from authentication middleware
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID is required",
      });
    }

    // Validate that all required fields are provided
    if (!name || !location || !cuisine || !email || !phone) {
      return res.status(400).json({
        message:
          "All fields (name, location, cuisine, email, phone) are required",
      });
    }

    // Check if a request with the same email already exists
    const existingRequest = await SellerRequest.findOne({ name });

    if (existingRequest) {
      return res.status(409).json({
        message: "A request with this name already exists",
      });
    }

    // Create a new seller request
    const newRequest = new SellerRequest({
      name,
      location,
      cuisine,
      email,
      phone,
      userId, // Associate the request with the user
    });

    // Save the new request to the database
    await newRequest.save();

    return res.status(201).json({
      message: "Request created successfully",
      data: newRequest,
    });
  } catch (error) {
    // Handle any errors that occur
    console.error("Error creating seller request:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
};
