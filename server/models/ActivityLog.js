const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: String, default: 'Admin' },
    entityType: { type: String, default: '' },
    entityId: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
