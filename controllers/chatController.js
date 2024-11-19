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
