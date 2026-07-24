import { NextRequest } from 'next/server';
export const dynamic = 'force-static';
import { connectToDatabase } from '@/lib/db';
import Inventory from '@/models/Inventory';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
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

    return NextResponse.json({
      success: true,
      data: formatted,
      meta: {
        totalValuation,
        lowStockCount,
        totalItems: items.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error fetching inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { itemName, type, quantity, unit, minThreshold, valuationPerUnit } = body;

    if (!itemName || !type) {
      return NextResponse.json({ success: false, message: 'Item name and type are required' }, { status: 400 });
    }

    const item = await Inventory.create({
      itemName,
      type,
      quantity: Number(quantity) || 0,
      unit: unit || 'kg',
      minThreshold: Number(minThreshold) || 10,
      valuationPerUnit: Number(valuationPerUnit) || 0,
    });

    return NextResponse.json({ success: true, data: item, message: 'Inventory item created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to create inventory item' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    const result = await Inventory.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} inventory records from database`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete inventory records' }, { status: 500 });
  }
}
