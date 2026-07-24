const mongoose = require('mongoose');

const returnOrderSchema = new mongoose.Schema(
  {
    returnNumber: { type: String, required: true, unique: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopName: { type: String, default: '' },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
    returnDate: { type: Date, default: Date.now },
    items: [
      {
        sproutType: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'packets' },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }
      }
    ],
    totalRefundAmount: { type: Number, required: true },
    reason: { type: String, default: 'Unsold / Expired Return' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReturnOrder', returnOrderSchema);
