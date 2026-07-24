const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['rent', 'electricity', 'labour', 'transport', 'packaging', 'misc'],
      default: 'misc'
    },
    amount: { type: Number, required: true },
    expenseDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'bank_transfer'], default: 'cash' },
    receiptUrl: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
