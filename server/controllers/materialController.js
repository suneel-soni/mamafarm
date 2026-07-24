const Material = require('../models/Material');
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate('supplier', 'name phone').sort({ purchaseDate: -1, createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterialSummary = async (req, res) => {
  try {
    const { filter = 'this_month', startDate, endDate } = req.query;

    let start = new Date(0);
    let end = new Date();

    const now = new Date();
    if (filter === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filter === 'yesterday') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filter === 'this_week') {
      const day = now.getDay() || 7;
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
    } else if (filter === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    const materials = await Material.find({
      $or: [
        { purchaseDate: { $gte: start, $lte: end } },
        { createdAt: { $gte: start, $lte: end } },
      ],
    })
      .populate('supplier', 'name phone')
      .sort({ purchaseDate: -1, createdAt: -1 });

    let totalPurchaseCost = 0;
    const count = materials.length;

    const groupedMap = {};

    materials.forEach((mat) => {
      const cost = Number(mat.quantity || 0) * Number(mat.purchasePrice || 0);
      totalPurchaseCost += cost;

      const d = mat.purchaseDate || mat.createdAt || new Date();
      const dateStr = new Date(d).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      if (!groupedMap[dateStr]) {
        groupedMap[dateStr] = {
          date: dateStr,
          materials: [],
          totalCost: 0,
          count: 0,
        };
      }

      groupedMap[dateStr].materials.push(mat);
      groupedMap[dateStr].totalCost += cost;
      groupedMap[dateStr].count += 1;
    });

    const averagePurchaseCost = count > 0 ? totalPurchaseCost / count : 0;
    const groupedSummary = Object.values(groupedMap);

    res.json({
      success: true,
      data: {
        totalPurchaseCost,
        numberOfPurchases: count,
        averagePurchaseCost,
        groupedSummary,
        materials,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('supplier');
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { name, category, supplier, quantity, unit, purchasePrice, gstPercent, minStockAlert, invoiceNumber, paymentStatus, notes, purchaseDate } = req.body;
    
    const totalCost = Number(quantity || 0) * Number(purchasePrice || 0);

    const material = await Material.create({
      name,
      category,
      supplier,
      quantity,
      unit,
      purchasePrice,
      gstPercent,
      minStockAlert,
      invoiceNumber,
      paymentStatus,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      notes,
    });

    // Update or create Inventory record
    await Inventory.findOneAndUpdate(
      { itemName: name },
      {
        itemName: name,
        type: 'raw_material',
        $inc: { quantity: Number(quantity || 0) },
        unit,
        minThreshold: minStockAlert || 10,
        valuationPerUnit: purchasePrice,
      },
      { upsert: true, new: true }
    );

    // Update Supplier pending payment if applicable
    if (supplier && paymentStatus !== 'paid') {
      await Supplier.findByIdAndUpdate(supplier, {
        $inc: { totalPurchased: totalCost, pendingPayment: totalCost }
      });
    } else if (supplier) {
      await Supplier.findByIdAndUpdate(supplier, {
        $inc: { totalPurchased: totalCost }
      });
    }

    await ActivityLog.create({
      action: 'Material Purchased',
      description: `Purchased ${quantity} ${unit} of ${name} (Inv: ${invoiceNumber || 'N/A'})`,
      entityType: 'Material',
      entityId: material._id,
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
