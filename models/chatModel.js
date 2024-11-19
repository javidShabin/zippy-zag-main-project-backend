const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  message: { type: String, required: true },
  sender: { type: String, enum: ["user", "admin"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("ChatMessage", chatSchema);
module.exports = { Chat };
