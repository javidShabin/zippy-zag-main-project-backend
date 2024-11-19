const express = require("express");
const { sendMessage, getChatHistory, removeAllChats, getUsersWithChats } = require("../../controllers/chatController");
const router = express.Router();

router.post('/send', sendMessage);
router.get('/:userId', getChatHistory);
router.delete('/:userId', removeAllChats)
router.get('/chatUser', getUsersWithChats)

module.exports = { chatRouter: router };