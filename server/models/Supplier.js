const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    address: { type: String, default: '' },
    gstNumber: { type: String, trim: true, default: '' },
    totalPurchased: { type: Number, default: 0 },
    pendingPayment: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
