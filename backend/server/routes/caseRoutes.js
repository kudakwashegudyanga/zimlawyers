const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createCase, getMyCases, searchCases } = require('../controllers/caseController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/cases - Create a new case
router.post('/', createCase);

// GET /api/cases - Get user's cases
router.get('/', getMyCases);

// GET /api/cases/search - Search cases
router.get('/search', searchCases);

module.exports = router;
