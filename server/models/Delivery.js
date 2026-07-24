const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    deliveryNumber: { type: String, required: true, unique: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopName: { type: String, default: '' },
    deliveryDate: { type: Date, default: Date.now },
    items: [
      {
        sproutType: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'packets' },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }
      }
    ],
    subTotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'unpaid' },
    deliveryPerson: { type: String, default: 'Self' },
    invoiceUrl: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
