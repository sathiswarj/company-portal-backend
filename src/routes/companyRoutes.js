const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, companyController.getCompanies);
router.get('/:id', authMiddleware, companyController.getCompanyById);
router.post('/', authMiddleware, companyController.createCompany);

module.exports = router;
