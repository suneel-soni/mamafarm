const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ type: 1, itemName: 1 });

    let totalValuation = 0;
    let lowStockCount = 0;

    const formatted = items.map((item) => {
      const val = item.quantity * (item.valuationPerUnit || 0);
      totalValuation += val;
      const isLowStock = item.quantity <= item.minThreshold;
      if (isLowStock) lowStockCount++;

      return {
        ...item.toObject(),
        stockValuation: val,
        isLowStock,
      };
    });

    res.json({
      success: true,
      data: formatted,
      meta: {
        totalValuation,
        lowStockCount,
        totalItems: items.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, minThreshold, valuationPerUnit } = req.body;

    const updated = await Inventory.findByIdAndUpdate(
      id,
      { quantity, minThreshold, valuationPerUnit },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
