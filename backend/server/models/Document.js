const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  visibility: {
    type: String,
    enum: ['PRIVATE', 'PUBLIC'],
    default: 'PRIVATE'
  },
  category: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ owner: 1, visibility: 1 });
documentSchema.index({ visibility: 1 });
documentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Document', documentSchema);
