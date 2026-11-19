const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, leadController.getLeads);
router.post('/', authMiddleware, leadController.createLead);
router.put('/:id', authMiddleware, leadController.updateLead);
router.delete('/:id', authMiddleware, leadController.softDeleteLead);

module.exports = router;
