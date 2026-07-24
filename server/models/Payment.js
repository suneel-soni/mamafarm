const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, required: true },
    entityType: { type: String, enum: ['shop', 'supplier'], required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    partyName: { type: String, default: '' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'bank_transfer', 'cheque'], default: 'cash' },
    transactionRef: { type: String, default: '' },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
