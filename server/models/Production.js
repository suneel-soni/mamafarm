const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema(
  {
    batchNumber: { type: String, required: true, unique: true },
    rawMaterialName: { type: String, required: true }, // e.g. Green Moong Bean
    rawMaterialQty: { type: Number, required: true }, // kg
    unit: { type: String, default: 'kg' },
    sproutType: { type: String, required: true }, // e.g. Moong Sprouts
    sproutsProducedQty: { type: Number, required: true }, // kg or packets
    sproutsUnit: { type: String, default: 'packets' },
    wasteQty: { type: Number, default: 0 },
    lossPercent: { type: Number, default: 0 },
    soakingStartDate: { type: Date, default: Date.now },
    completionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['in_progress', 'completed', 'cancelled'], default: 'completed' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Production', productionSchema);
