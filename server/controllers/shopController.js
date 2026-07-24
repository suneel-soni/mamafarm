const Shop = require('../models/Shop');
const Delivery = require('../models/Delivery');
const Payment = require('../models/Payment');

exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: 1 });

    const formattedShops = await Promise.all(
      shops.map(async (s, index) => {
        const code = s.shopCode && s.shopCode.trim() !== '' ? s.shopCode : `SHOP-${101 + index}`;
        if (!s.shopCode || s.shopCode.trim() === '') {
          await Shop.findByIdAndUpdate(s._id, { shopCode: code });
        }

        const currentQuantity = Math.max(0, (s.totalDeliveredQuantity || 0) - (s.totalReturnedQuantity || 0));
        const remainingPayment = Math.max(0, (s.totalDeliveredValue || 0) - (s.totalPaidAmount || 0));

        return {
          ...s.toObject(),
          shopCode: code,
          currentQuantity,
          outstandingBalance: remainingPayment,
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

    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const deliveries = await Delivery.find({ shop: shop._id }).sort({ deliveryDate: -1 });
    const payments = await Payment.find({ shopId: shop._id }).sort({ paymentDate: -1 });

    res.json({
      success: true,
      data: {
        shop: {
          ...shop.toObject(),
          shopCode: shop.shopCode || 'SHOP-101',
        },
        deliveryHistory: deliveries,
        paymentHistory: payments,
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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
