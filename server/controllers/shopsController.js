const Shop = require('../models/Shop');
const Delivery = require('../models/Delivery');
const ReturnOrder = require('../models/ReturnOrder');
const Payment = require('../models/Payment');

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true }).sort({ createdAt: 1 });

    const formattedShops = await Promise.all(
      shops.map(async (s, index) => {
        const code = (s.shopCode && s.shopCode.trim() !== '') ? s.shopCode : `SHOP-${101 + index}`;
        if (!s.shopCode || s.shopCode.trim() === '') {
          await Shop.findByIdAndUpdate(s._id, { shopCode: code });
        }

        const currentQuantity = Math.max(0, (s.totalDeliveredQuantity || 0) - (s.totalReturnedQuantity || 0));
        const remainingPayment = Math.max(0, (s.totalDeliveredValue || 0) - (s.totalPaidAmount || 0));

        return {
          _id: s._id,
          shopCode: code,
          shopName: s.shopName,
          ownerName: s.ownerName,
          phone: s.phone,
          address: s.address,
          area: s.area,
          gstNumber: s.gstNumber,
          image: s.image,
          currentQuantity,
          outstandingBalance: remainingPayment,
          totalDeliveredQuantity: s.totalDeliveredQuantity || 0,
          totalReturnedQuantity: s.totalReturnedQuantity || 0,
          totalDeliveredValue: s.totalDeliveredValue || 0,
          totalPaidAmount: s.totalPaidAmount || 0,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        };
      })
    );

    res.json({ success: true, data: formattedShops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    let shop;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      shop = await Shop.findById(id);
    } else {
      shop = await Shop.findOne({ shopCode: id.toUpperCase() });
    }

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop partner not found' });
    }

    const shopMongoId = shop._id.toString();

    // Fetch deliveries, returns, and payments for this shop
    const deliveries = await Delivery.find({ shop: shopMongoId }).sort({ deliveryDate: -1 });
    const returns = await ReturnOrder.find({ shop: shopMongoId }).sort({ returnDate: -1 });
    const payments = await Payment.find({ shopId: shopMongoId, entityType: 'shop' }).sort({ paymentDate: -1 });

    // Calculate aggregated metrics
    const totalDeliveredQty = deliveries.reduce((acc, d) => {
      return acc + (d.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, 0);

    const totalReturnedQty = returns.reduce((acc, r) => {
      return acc + (r.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, 0);

    const currentQuantity = Math.max(0, totalDeliveredQty - totalReturnedQty);

    const totalDeliveredValue = deliveries.reduce((acc, d) => acc + (d.netAmount || 0), 0);
    const totalPaidAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalReturnedValue = returns.reduce((acc, r) => acc + (r.totalRefundAmount || 0), 0);

    const pendingPayment = Math.max(0, totalDeliveredValue - totalPaidAmount - totalReturnedValue);

    // Build Sales Graph (Grouped by date)
    const salesByDateMap = {};
    deliveries.forEach((d) => {
      const dateKey = new Date(d.deliveryDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      });
      if (!salesByDateMap[dateKey]) {
        salesByDateMap[dateKey] = { date: dateKey, amount: 0, quantity: 0 };
      }
      salesByDateMap[dateKey].amount += d.netAmount || 0;
      salesByDateMap[dateKey].quantity += (d.items || []).reduce((sum, it) => sum + it.quantity, 0);
    });

    const salesGraph = Object.values(salesByDateMap).reverse();

    // Build Ledger Timeline (Merging Delivery [Debit], Payment [Credit], Return [Credit])
    const ledgerEntries = [];

    deliveries.forEach((d) => {
      ledgerEntries.push({
        timestamp: new Date(d.deliveryDate).getTime(),
        date: new Date(d.deliveryDate).toLocaleDateString('en-IN'),
        type: 'delivery',
        reference: d.deliveryNumber,
        description: `Sprouts Dispatch (${d.items.length} items)`,
        debit: d.netAmount,
        credit: 0,
      });
    });

    payments.forEach((p) => {
      ledgerEntries.push({
        timestamp: new Date(p.paymentDate).getTime(),
        date: new Date(p.paymentDate).toLocaleDateString('en-IN'),
        type: 'payment',
        reference: p.paymentNumber,
        description: `Payment Received (${p.paymentMethod.toUpperCase()})`,
        debit: 0,
        credit: p.amount,
      });
    });

    returns.forEach((r) => {
      ledgerEntries.push({
        timestamp: new Date(r.returnDate).getTime(),
        date: new Date(r.returnDate).toLocaleDateString('en-IN'),
        type: 'return',
        reference: r.returnNumber,
        description: `Order Return (${r.reason})`,
        debit: 0,
        credit: r.totalRefundAmount,
      });
    });

    // Sort entries chronologically and calculate running balance
    ledgerEntries.sort((a, b) => a.timestamp - b.timestamp);

    let runningBalance = 0;
    const ledger = ledgerEntries.map((entry) => {
      runningBalance += entry.debit - entry.credit;
      return {
        ...entry,
        balance: Math.max(0, runningBalance),
      };
    }).reverse();

    const shopData = {
      ...shop.toObject(),
      currentQuantity,
      outstandingBalance: pendingPayment,
      totalDeliveredQuantity: totalDeliveredQty,
      totalReturnedQuantity: totalReturnedQty,
      totalDeliveredValue,
      totalPaidAmount,
    };

    res.json({
      success: true,
      data: {
        shop: shopData,
        summary: {
          totalDeliveredQty,
          totalReturnedQty,
          currentQuantity,
          totalDeliveredValue,
          totalPaidAmount,
          pendingPayment,
        },
        salesGraph,
        recentOrders: deliveries.slice(0, 10),
        recentReturns: returns.slice(0, 10),
        ledger,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createShop = async (req, res) => {
  try {
    if (!req.body.shopCode) {
      const count = await Shop.countDocuments();
      req.body.shopCode = `SHOP-${101 + count}`;
    }
    const shop = await Shop.create(req.body);
    res.status(201).json({ success: true, data: shop });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    await Shop.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Shop partner deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
