const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/authMiddleware');
const {
  createDocument,
  getMyDocuments,
  getSharedTemplates,
  cloneTemplate,
  adminUploadTemplate,
  getTemplatesByCategory,
  cloneMultipleTemplates
} = require('../controllers/documentController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /create - Create a new document
router.post('/create', createDocument);

// GET /my-documents - Get user's private documents
router.get('/my-documents', authMiddleware, getMyDocuments);

// GET /shared-templates - Get public templates
router.get('/shared-templates', authMiddleware, getSharedTemplates);

// GET /templates - Get templates by category
router.get('/templates', getTemplatesByCategory);

// POST /clone/:templateId - Clone a public template
router.post('/clone/:templateId', authMiddleware, cloneTemplate);

// POST /clone-multiple - Clone multiple templates
router.post('/clone-multiple', authMiddleware, cloneMultipleTemplates);

// POST /admin/upload - Admin only: upload a new template
router.post('/admin/upload', allowRoles('ADMIN'), adminUploadTemplate);

module.exports = router;
