const Template = require('../models/Template');

// Create a new template (Admin only)
const createTemplate = async (req, res) => {
  try {
    const { title, category, customCategory, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Prepare template data
    const templateData = {
      title: title.trim(),
      category,
      content: content.trim(),
      createdBy: req.user._id
    };

    // If category is "Other", use customCategory as the actual category
    if (category === 'Other' && customCategory) {
      templateData.category = customCategory.trim();
      templateData.customCategory = customCategory.trim();
    }

    // Create template
    const template = new Template(templateData);
    await template.save();

    // Populate creator info
    await template.populate('createdBy', 'fullName email');

    res.status(201).json({
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Server error creating template' });
  }
};

// Get all templates (for lawyers)
const getTemplates = async (req, res) => {
  try {
    const { category } = req.query;
    
    // Build query
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    // Get templates with creator info
    const templates = await Template.find(query)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Templates retrieved successfully',
      templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error retrieving templates' });
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id)
      .populate('createdBy', 'fullName email');

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({
      message: 'Template retrieved successfully',
      template
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ message: 'Server error retrieving template' });
  }
};

// Get all available categories
const getCategories = async (req, res) => {
  try {
    // Get predefined categories
    const predefinedCategories = ['Murder', 'Theft', 'Fraud', 'Assault', 'Corporate Law', 'Divorce', 'Land Disputes', 'Other'];
    
    // Get custom categories from templates
    const customCategories = await Template.distinct('customCategory', { customCategory: { $exists: true, $ne: null } });
    
    // Combine and remove duplicates
    const allCategories = [...predefinedCategories, ...customCategories].filter(Boolean);
    
    res.json({
      message: 'Categories retrieved successfully',
      categories: allCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error retrieving categories' });
  }
};

// Delete a template (Admin only)
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if user is the creator or admin
    if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own templates.' });
    }

    await Template.findByIdAndDelete(id);

    res.json({
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Server error deleting template' });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  getCategories,
  deleteTemplate
};
