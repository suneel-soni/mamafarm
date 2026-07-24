const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ['raw_material', 'finished_sprout', 'packaging'], required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true, default: 'kg' },
    minThreshold: { type: Number, default: 10 },
    valuationPerUnit: { type: Number, default: 0 },
    location: { type: String, default: 'Main Store' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
