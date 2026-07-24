const mongoose = require('mongoose');

const deliveryItemSchema = new mongoose.Schema(
  {
    sproutType: { type: String, required: true }, // e.g. Moong Sprouts, Chana Sprouts, Mixed Sprouts
    quantity: { type: Number, required: true },
    weight: { type: Number, default: 0 }, // in grams or kg
    unit: { type: String, default: 'packets' }, // packets, kg, boxes
    rate: { type: Number, required: true },
    amount: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryItem', deliveryItemSchema);
