const express = require('express');
const groupController = require('../controllers/group');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.post('/createGroup', authMiddleware.authenticate, groupController.createGroup);
router.get('/fetchGroup/:id', authMiddleware.authenticate, groupController.fetchGroup);


module.exports = router;

