const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/ai/query - AI assistant query
router.post('/query', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ 
        message: 'Question is required' 
      });
    }

    // Placeholder AI response for now
    // Later integrate with OpenAI API
    const aiResponse = `As a legal AI assistant for Zimbabwe law, I'll help you with: "${question}". 

This is a placeholder response. The actual AI integration will be implemented in a future update with OpenAI or similar service.

For now, I can provide general guidance on:
- Zimbabwe legal procedures
- Document templates
- Case management best practices
- Legal research assistance

Please consult with qualified legal professionals for specific legal advice.`;

    res.json({
      answer: aiResponse,
      question: question,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ 
      message: 'Server error processing AI query' 
    });
  }
});

module.exports = router;
