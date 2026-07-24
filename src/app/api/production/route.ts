import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Production from '@/models/Production';
import Inventory from '@/models/Inventory';
import Material from '@/models/Material';
import ActivityLog from '@/models/ActivityLog';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();
    const batches = await Production.find().sort({ completionDate: -1 });
    return successResponse(batches);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching production batches', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      rawMaterialName,
      rawMaterialQty,
      unit,
      sproutType,
      sproutsProducedQty,
      sproutsUnit,
      wasteQty,
      notes,
    } = body;

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

    await Inventory.findOneAndUpdate(
      { itemName: { $regex: new RegExp(rawMaterialName, 'i') } },
      { $inc: { quantity: -rawQty } }
    );

    await Material.findOneAndUpdate(
      { name: { $regex: new RegExp(rawMaterialName, 'i') } },
      { $inc: { quantity: -rawQty } }
    );

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
      entityId: String(batch._id),
    });

    return successResponse(batch, 'Production batch logged successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to log production batch', 500);
  }
}
