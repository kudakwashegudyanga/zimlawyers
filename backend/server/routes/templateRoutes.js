const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/authMiddleware');
const {
  createTemplate,
  getTemplates,
  getTemplateById,
  getCategories,
  deleteTemplate
} = require('../controllers/templateController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST / - Create a new template (Admin only)
router.post('/', allowRoles('ADMIN'), createTemplate);

// GET / - Get all templates (for lawyers)
router.get('/', getTemplates);

// GET /categories - Get all available categories
router.get('/categories', getCategories);

// GET /:id - Get template by ID
router.get('/:id', getTemplateById);

// DELETE /:id - Delete template (Admin only)
router.delete('/:id', allowRoles('ADMIN'), deleteTemplate);

module.exports = router;
