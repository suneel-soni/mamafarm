const Delivery = require('../models/Delivery');
const Shop = require('../models/Shop');
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('shop', 'shopName ownerName phone address image').sort({ deliveryDate: -1 });
    res.json({ success: true, data: deliveries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('shop');
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const { shopId, deliveryDate, items, discount, amountPaid, deliveryPerson, notes } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    let subTotal = 0;
    let totalOrderQty = 0;

    const processedItems = (items || []).map((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const amt = qty * rate;
      subTotal += amt;
      totalOrderQty += qty;

      return {
        sproutType: item.sproutType,
        quantity: qty,
        unit: item.unit || 'packets',
        rate,
        amount: amt,
      };
    });

    const disc = Number(discount || 0);
    const netAmount = Math.max(0, subTotal - disc);
    const paid = Number(amountPaid || 0);
    const pendingAmount = netAmount - paid;

    let paymentStatus = 'unpaid';
    if (paid >= netAmount) paymentStatus = 'paid';
    else if (paid > 0) paymentStatus = 'partial';

    const count = await Delivery.countDocuments();
    const deliveryNumber = `DEL-2026-${String(count + 1).padStart(3, '0')}`;
    const dispatchDate = deliveryDate ? new Date(deliveryDate) : new Date();

    const delivery = await Delivery.create({
      deliveryNumber,
      shop: shopId,
      shopName: shop.shopName,
      deliveryDate: dispatchDate,
      items: processedItems,
      subTotal,
      discount: disc,
      netAmount,
      amountPaid: paid,
      paymentStatus,
      deliveryPerson: deliveryPerson || 'Self',
      notes,
    });

    // Business Logic: Deliveries update customer outstanding balance & quantities
    await Shop.findByIdAndUpdate(shopId, {
      $inc: {
        totalDeliveredQuantity: totalOrderQty,
        outstandingBalance: pendingAmount,
        totalDeliveredValue: netAmount,
        totalPaidAmount: paid,
      },
      lastDeliveryDate: dispatchDate,
    });

    // Business Logic: Reduce finished sprout items from inventory
    for (const item of processedItems) {
      await Inventory.findOneAndUpdate(
        { itemName: item.sproutType },
        { $inc: { quantity: -item.quantity } }
      );
    }

    await ActivityLog.create({
      action: 'Delivery Created',
      description: `Dispatched ${deliveryNumber} to ${shop.shopName} (Net: ₹${netAmount})`,
      entityType: 'Delivery',
      entityId: delivery._id,
    });

    res.status(201).json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { paymentStatus, amountPaid } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    if (amountPaid !== undefined) {
      const addedPaid = Number(amountPaid) - delivery.amountPaid;
      delivery.amountPaid = Number(amountPaid);
      if (addedPaid > 0) {
        await Shop.findByIdAndUpdate(delivery.shop, {
          $inc: { outstandingBalance: -addedPaid, totalPaidAmount: addedPaid },
        });
      }
    }

    if (paymentStatus) delivery.paymentStatus = paymentStatus;
    await delivery.save();

    res.json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
