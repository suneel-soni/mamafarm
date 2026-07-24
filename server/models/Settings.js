const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: 'MamaFarm Sprouts' },
    phone: { type: String, default: '+91 81301 88878' },
    email: { type: String, default: 'contact@mamafarm.com' },
    address: { type: String, default: 'Plot 42, Organic Agro Hub, India' },
    gstNumber: { type: String, default: '07AAAAA0000A1Z5' },
    currency: { type: String, default: '₹' },
    lowStockThreshold: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
