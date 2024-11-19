const { Chat } = require("../models/chatModel");

// Send a chat message (Admin or User)
const sendMessage = async (req, res) => {
  try {
    const { userId, message, sender } = req.body;

    // Check if the sender is admin or user
    const newMessage = new Chat({
      user: userId, // User to whom the message is being sent
      message,
      sender, // 'admin' or 'user', depends on who is sending
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};
// Get chat history for a specific user (for admin)
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all chat messages between the admin and the specific user
    const chatMessages = await Chat.find({ user: userId }).sort({
      createdAt: 1,
    });

    res.status(200).json(chatMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
