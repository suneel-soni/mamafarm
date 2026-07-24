const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    shopCode: { type: String, default: '' },
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    area: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'
    },
    totalDeliveredQuantity: { type: Number, default: 0 },
    totalReturnedQuantity: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    totalDeliveredValue: { type: Number, default: 0 },
    totalPaidAmount: { type: Number, default: 0 },
    lastDeliveryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shop', shopSchema);
