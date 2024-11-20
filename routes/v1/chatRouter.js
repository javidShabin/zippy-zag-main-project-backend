const express = require("express");
const { sendMessage, getChatHistory, removeAllChats, getUsersWithChats } = require("../../controllers/chatController");
const router = express.Router();

router.post('/send', sendMessage);
router.get('/getchat/:userId', getChatHistory);
router.delete('/remove-chat/:userId', removeAllChats)
router.get('/chatUser/:userId', getUsersWithChats)

module.exports = { chatRouter: router };