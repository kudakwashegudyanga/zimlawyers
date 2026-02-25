const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getDraftById,
  updateDraft,
  getUserDrafts,
  createDraft,
  deleteDraft
} = require('../controllers/draftCaseController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/drafts - Get all drafts for logged-in user
router.get('/', getUserDrafts);

// POST /api/drafts - Create new draft
router.post('/', createDraft);

// GET /api/drafts/:id - Get single draft by ID
router.get('/:id', getDraftById);

// PUT /api/drafts/:id - Update draft
router.put('/:id', updateDraft);

// DELETE /api/drafts/:id - Delete draft
router.delete('/:id', deleteDraft);

module.exports = router;
