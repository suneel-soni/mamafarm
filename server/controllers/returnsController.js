const ReturnOrder = require('../models/ReturnOrder');
const Shop = require('../models/Shop');
const Inventory = require('../models/Inventory');

exports.createReturnOrder = async (req, res) => {
  try {
    const { shopId, deliveryId, items, reason, notes } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop partner not found' });
    }

    const returnNumber = 'RET-' + Date.now().toString().slice(-6);

    let totalRefundAmount = 0;
    let totalReturnQty = 0;

    const processedItems = items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const amount = qty * rate;
      totalRefundAmount += amount;
      totalReturnQty += qty;

      return {
        sproutType: item.sproutType,
        quantity: qty,
        unit: item.unit || 'packets',
        rate,
        amount,
      };
    });

    const returnOrder = await ReturnOrder.create({
      returnNumber,
      shop: shopId,
      shopName: shop.shopName,
      deliveryId,
      items: processedItems,
      totalRefundAmount,
      reason: reason || 'Unsold / Damaged Return',
      notes,
    });

    // Update Shop's totalReturnedQuantity and outstanding balance
    shop.totalReturnedQuantity = (shop.totalReturnedQuantity || 0) + totalReturnQty;
    shop.outstandingBalance = Math.max(0, (shop.outstandingBalance || 0) - totalRefundAmount);
    await shop.save();

    res.status(201).json({ success: true, data: returnOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllReturnOrders = async (req, res) => {
  try {
    const { shopId } = req.query;
    const filter = shopId ? { shop: shopId } : {};
    const returns = await ReturnOrder.find(filter).sort({ returnDate: -1 });
    res.json({ success: true, data: returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
