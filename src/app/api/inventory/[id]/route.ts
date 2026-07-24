import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inventory from '@/models/Inventory';
import { successResponse, errorResponse } from '@/helpers/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const { quantity, minThreshold, valuationPerUnit } = body;

    const updated = await Inventory.findByIdAndUpdate(
      id,
      { quantity, minThreshold, valuationPerUnit },
      { new: true }
    );

    if (!updated) return errorResponse('Item not found', 404);
    return successResponse(updated, 'Inventory updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update inventory item', 500);
  }
}
