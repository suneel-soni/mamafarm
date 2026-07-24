const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Raw Bean', 'Packaging', 'Chemicals/Cleaning', 'Other'], default: 'Raw Bean' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    quantity: { type: Number, default: 0 },
    unit: { type: String, required: true, default: 'kg' }, // kg, g, bags, pcs
    purchasePrice: { type: Number, required: true, default: 0 },
    gstPercent: { type: Number, default: 0 },
    minStockAlert: { type: Number, default: 10 },
    invoiceNumber: { type: String, default: '' },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partial'], default: 'paid' },
    purchaseDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
