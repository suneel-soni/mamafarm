import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Material from '@/models/Material';
import Supplier from '@/models/Supplier';
import Inventory from '@/models/Inventory';
import ActivityLog from '@/models/ActivityLog';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();
    const materials = await Material.find().populate('supplier', 'name phone').sort({ purchaseDate: -1, createdAt: -1 });
    return successResponse(materials);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching materials', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, category, supplier, quantity, unit, purchasePrice, gstPercent, minStockAlert, invoiceNumber, paymentStatus, notes, purchaseDate } = body;

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

    if (supplier && paymentStatus !== 'paid') {
      await Supplier.findByIdAndUpdate(supplier, {
        $inc: { totalPurchased: totalCost, pendingPayment: totalCost },
      });
    } else if (supplier) {
      await Supplier.findByIdAndUpdate(supplier, {
        $inc: { totalPurchased: totalCost },
      });
    }

    await ActivityLog.create({
      action: 'Material Purchased',
      description: `Purchased ${quantity} ${unit} of ${name} (Inv: ${invoiceNumber || 'N/A'})`,
      entityType: 'Material',
      entityId: String(material._id),
    });

    return successResponse(material, 'Material purchased successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to record material purchase', 500);
  }
}
