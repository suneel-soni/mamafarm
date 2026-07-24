import { NextRequest } from 'next/server';
export const dynamic = 'force-static';
export function generateStaticParams() { return [{ id: 'stub' }]; }
import { connectToDatabase } from '@/lib/db';
import Supplier from '@/models/Supplier';
import Material from '@/models/Material';
import Payment from '@/models/Payment';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const supplier = await Supplier.findById(id);
    if (!supplier) return errorResponse('Supplier not found', 404);

    const materials = await Material.find({ supplier: supplier._id });
    const payments = await Payment.find({ supplier: supplier._id });

    return successResponse({
      ...supplier.toObject(),
      purchaseHistory: materials,
      paymentHistory: payments,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching supplier', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();

    const supplier = await Supplier.findByIdAndUpdate(id, body, { new: true });
    if (!supplier) return errorResponse('Supplier not found', 404);
    return successResponse(supplier, 'Supplier updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update supplier', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) return errorResponse('Supplier not found', 404);
    return successResponse(null, 'Supplier deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete supplier', 500);
  }
}
