const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

router.get('/health', exampleController.getHealth);

module.exports = router;
