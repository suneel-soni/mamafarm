const Production = require('../models/Production');
const Inventory = require('../models/Inventory');
const Material = require('../models/Material');
const ActivityLog = require('../models/ActivityLog');

exports.getBatches = async (req, res) => {
  try {
    const batches = await Production.find().sort({ completionDate: -1 });
    res.json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBatch = async (req, res) => {
  try {
    const {
      rawMaterialName,
      rawMaterialQty,
      unit,
      sproutType,
      sproutsProducedQty,
      sproutsUnit,
      wasteQty,
      notes,
    } = req.body;

    const count = await Production.countDocuments();
    const batchNumber = `BATCH-2026-${String(count + 1).padStart(2, '0')}`;

    const rawQty = Number(rawMaterialQty || 0);
    const prodQty = Number(sproutsProducedQty || 0);
    const waste = Number(wasteQty || 0);
    const lossPct = rawQty > 0 ? Number(((waste / rawQty) * 100).toFixed(2)) : 0;

    const batch = await Production.create({
      batchNumber,
      rawMaterialName,
      rawMaterialQty: rawQty,
      unit: unit || 'kg',
      sproutType,
      sproutsProducedQty: prodQty,
      sproutsUnit: sproutsUnit || 'packets',
      wasteQty: waste,
      lossPercent: lossPct,
      completionDate: new Date(),
      status: 'completed',
      notes,
    });

    // Business Logic 1: Deduct Raw Material consumed from Inventory / Material
    await Inventory.findOneAndUpdate(
      { itemName: { $regex: new RegExp(rawMaterialName, 'i') } },
      { $inc: { quantity: -rawQty } }
    );

    await Material.findOneAndUpdate(
      { name: { $regex: new RegExp(rawMaterialName, 'i') } },
      { $inc: { quantity: -rawQty } }
    );

    // Business Logic 2: Add Sprouts Produced to Finished Sprouts Inventory
    await Inventory.findOneAndUpdate(
      { itemName: { $regex: new RegExp(sproutType, 'i') } },
      {
        itemName: sproutType,
        type: 'finished_sprout',
        $inc: { quantity: prodQty },
        unit: sproutsUnit || 'packets',
        minThreshold: 50,
      },
      { upsert: true, new: true }
    );

    await ActivityLog.create({
      action: 'Production Logged',
      description: `Completed ${batchNumber}: Used ${rawQty}kg ${rawMaterialName} -> Produced ${prodQty} ${sproutsUnit} ${sproutType}`,
      entityType: 'Production',
      entityId: batch._id,
    });

    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
