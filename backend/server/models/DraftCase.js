const mongoose = require('mongoose');

const draftCaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Murder', 'Theft', 'Fraud', 'Assault', 'Corporate Law', 'Divorce', 'Land Disputes', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['Draft', 'In Progress', 'Closed'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DraftCase', draftCaseSchema);
