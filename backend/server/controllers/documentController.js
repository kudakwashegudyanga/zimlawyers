const Document = require('../models/Document');

const createDocument = async (req, res) => {
  try {
    const { title, content, visibility = 'PRIVATE', category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const document = new Document({
      title,
      content,
      owner: visibility === 'PRIVATE' ? req.user._id : null,
      visibility,
      category,
      createdBy: req.user._id
    });

    await document.save();

    res.status(201).json({
      message: 'Document created successfully',
      document
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Server error creating document' });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ 
      owner: req.user._id,
      visibility: 'PRIVATE'
    }).populate('createdBy', 'fullName email').sort({ createdAt: -1 });

    res.json({
      message: 'My documents retrieved successfully',
      documents
    });
  } catch (error) {
    console.error('Get my documents error:', error);
    res.status(500).json({ message: 'Server error retrieving documents' });
  }
};

const getSharedTemplates = async (req, res) => {
  try {
    const templates = await Document.find({ 
      visibility: 'PUBLIC',
      owner: null
    }).populate('createdBy', 'fullName email').sort({ createdAt: -1 });

    res.json({
      message: 'Shared templates retrieved successfully',
      templates
    });
  } catch (error) {
    console.error('Get shared templates error:', error);
    res.status(500).json({ message: 'Server error retrieving templates' });
  }
};

const cloneTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await Document.findOne({ 
      _id: templateId,
      visibility: 'PUBLIC',
      owner: null
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const clonedDocument = new Document({
      title: `${template.title} (Copy)`,
      content: template.content,
      owner: req.user._id,
      visibility: 'PRIVATE',
      category: template.category,
      createdBy: req.user._id
    });

    await clonedDocument.save();

    res.status(201).json({
      message: 'Template cloned successfully',
      document: clonedDocument
    });
  } catch (error) {
    console.error('Clone template error:', error);
    res.status(500).json({ message: 'Server error cloning template' });
  }
};

const adminUploadTemplate = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const template = new Document({
      title,
      content,
      owner: null,
      visibility: 'PUBLIC',
      category,
      createdBy: req.user._id
    });

    await template.save();

    res.status(201).json({
      message: 'Template uploaded successfully',
      template
    });
  } catch (error) {
    console.error('Admin upload template error:', error);
    res.status(500).json({ message: 'Server error uploading template' });
  }
};

const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {
      visibility: 'PUBLIC',
      owner: null
    };

    if (category) {
      filter.category = category;
    }

    const templates = await Document.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Templates retrieved successfully',
      templates,
      category: category || 'all'
    });
  } catch (error) {
    console.error('Get templates by category error:', error);
    res.status(500).json({ message: 'Server error retrieving templates' });
  }
};

const cloneMultipleTemplates = async (req, res) => {
  try {
    const { templateIds } = req.body;

    if (!templateIds || !Array.isArray(templateIds) || templateIds.length === 0) {
      return res.status(400).json({ message: 'Template IDs array is required' });
    }

    const clonedDocuments = [];

    for (const templateId of templateIds) {
      const template = await Document.findOne({
        _id: templateId,
        visibility: 'PUBLIC',
        owner: null
      });

      if (!template) {
        continue; // Skip invalid templates
      }

      const clonedDocument = new Document({
        title: `${template.title} (Copy)`,
        content: template.content,
        owner: req.user._id,
        visibility: 'PRIVATE',
        category: template.category,
        createdBy: req.user._id
      });

      await clonedDocument.save();
      clonedDocuments.push(clonedDocument);
    }

    res.status(201).json({
      message: `${clonedDocuments.length} templates cloned successfully`,
      documents: clonedDocuments
    });
  } catch (error) {
    console.error('Clone multiple templates error:', error);
    res.status(500).json({ message: 'Server error cloning templates' });
  }
};

module.exports = {
  createDocument,
  getMyDocuments,
  getSharedTemplates,
  cloneTemplate,
  adminUploadTemplate,
  getTemplatesByCategory,
  cloneMultipleTemplates
};
