const express = require('express');
const router = express.Router();
const { processQuery } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/query', processQuery);

module.exports = router;
