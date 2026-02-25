const Case = require('../models/Case');

const createCase = async (req, res) => {
  try {
    const { title, description, clientName, status } = req.body;

    if (!title || !description || !clientName) {
      return res.status(400).json({ 
        message: 'Title, description, and client name are required' 
      });
    }

    const newCase = new Case({
      title,
      description,
      clientName,
      status: status || 'OPEN',
      lawyer: req.user._id
    });

    await newCase.save();
    await newCase.populate('lawyer', 'fullName email');

    res.status(201).json({
      message: 'Case created successfully',
      case: newCase
    });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ message: 'Server error creating case' });
  }
};

const getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ lawyer: req.user._id })
      .populate('lawyer', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Cases retrieved successfully',
      cases
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ message: 'Server error retrieving cases' });
  }
};

const searchCases = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i'); // Case-insensitive search

    const cases = await Case.find({
      lawyer: req.user._id,
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { clientName: { $regex: searchRegex } }
      ]
    })
    .populate('lawyer', 'fullName email')
    .sort({ createdAt: -1 });

    res.json({
      message: 'Search results retrieved successfully',
      cases,
      query: q
    });
  } catch (error) {
    console.error('Search cases error:', error);
    res.status(500).json({ message: 'Server error searching cases' });
  }
};

module.exports = {
  createCase,
  getMyCases,
  searchCases
};
