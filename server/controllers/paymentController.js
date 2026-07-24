const Payment = require('../models/Payment');
const Shop = require('../models/Shop');
const Supplier = require('../models/Supplier');
const ActivityLog = require('../models/ActivityLog');

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('shop', 'shopName')
      .populate('supplier', 'name')
      .sort({ paymentDate: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { entityType, shopId, supplierId, amount, paymentMethod, transactionRef, paymentDate, notes } = req.body;
    const payAmt = Number(amount || 0);

    if (payAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    const count = await Payment.countDocuments();
    const paymentNumber = `PAY-2026-${String(count + 1).padStart(3, '0')}`;

    let partyName = '';

    if (entityType === 'shop' && shopId) {
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
      partyName = shop.shopName;

      // Business Logic: Payment reduces shop outstanding balance automatically
      await Shop.findByIdAndUpdate(shopId, {
        $inc: { outstandingBalance: -payAmt, totalPaidAmount: payAmt },
      });
    } else if (entityType === 'supplier' && supplierId) {
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
      partyName = supplier.name;

      // Business Logic: Payment reduces supplier pending dues
      await Supplier.findByIdAndUpdate(supplierId, {
        $inc: { pendingPayment: -payAmt },
      });
    }

    const payment = await Payment.create({
      paymentNumber,
      entityType,
      shop: shopId || null,
      supplier: supplierId || null,
      partyName,
      amount: payAmt,
      paymentMethod: paymentMethod || 'cash',
      transactionRef: transactionRef || '',
      paymentDate: paymentDate || new Date(),
      notes: notes || '',
    });

    await ActivityLog.create({
      action: 'Payment Received/Made',
      description: `Recorded payment ${paymentNumber} of ₹${payAmt} for ${partyName}`,
      entityType: 'Payment',
      entityId: payment._id,
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
