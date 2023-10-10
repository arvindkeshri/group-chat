const express = require('express');
const chatController = require('../controllers/chat');
const authenticate = require('../middleware/auth');

const router = express.Router();


router.post('/chat', authenticate, chatController.sendMessage);

module.exports = router;

