import { NextRequest } from 'next/server';
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
