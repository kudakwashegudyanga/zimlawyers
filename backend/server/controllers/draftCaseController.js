const DraftCase = require('../models/DraftCase');

// Get single draft by ID
const getDraftById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const draft = await DraftCase.findById(id)
      .populate('createdBy', 'fullName email');
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    // Check if user owns this draft
    if (draft.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only view your own drafts.' });
    }

    res.json({
      message: 'Draft retrieved successfully',
      draft
    });
  } catch (error) {
    console.error('Get draft error:', error);
    res.status(500).json({ message: 'Server error retrieving draft' });
  }
};

// Update draft
const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    // Find the draft
    const draft = await DraftCase.findById(id);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    // Check if user owns this draft
    if (draft.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own drafts.' });
    }

    // Update draft
    const updatedDraft = await DraftCase.findByIdAndUpdate(
      id,
      { 
        title: title?.trim(),
        description: description?.trim(),
        status: status || draft.status,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Populate creator info for response
    await updatedDraft.populate('createdBy', 'fullName email');

    res.json({
      message: 'Draft updated successfully',
      draft: updatedDraft
    });
  } catch (error) {
    console.error('Update draft error:', error);
    res.status(500).json({ message: 'Server error updating draft' });
  }
};

// Get all drafts for logged-in user
const getUserDrafts = async (req, res) => {
  try {
    const drafts = await DraftCase.find({ createdBy: req.user._id })
      .populate('createdBy', 'fullName email')
      .sort({ updatedAt: -1 });

    res.json({
      message: 'Drafts retrieved successfully',
      drafts
    });
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({ message: 'Server error retrieving drafts' });
  }
};

// Create new draft
const createDraft = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: 'Title, description, and category are required' 
      });
    }

    const draft = new DraftCase({
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'Draft',
      createdBy: req.user._id
    });

    await draft.save();

    // Populate creator info for response
    await draft.populate('createdBy', 'fullName email');

    res.status(201).json({
      message: 'Draft created successfully',
      draft
    });
  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({ message: 'Server error creating draft' });
  }
};

// Delete draft
const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;
    
    const draft = await DraftCase.findById(id);
    
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found' });
    }

    // Check if user owns this draft
    if (draft.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own drafts.' });
    }

    await DraftCase.findByIdAndDelete(id);

    res.json({
      message: 'Draft deleted successfully'
    });
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ message: 'Server error deleting draft' });
  }
};

module.exports = {
  getDraftById,
  updateDraft,
  getUserDrafts,
  createDraft,
  deleteDraft
};
