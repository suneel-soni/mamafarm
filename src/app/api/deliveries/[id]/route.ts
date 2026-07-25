import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/db';
import Delivery from '@/models/Delivery';
import Shop from '@/models/Shop';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const delivery = await Delivery.findById(id).populate('shop');
    if (!delivery) return errorResponse('Delivery not found', 404);
    return successResponse(delivery);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching delivery', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const { paymentStatus, amountPaid } = body;

    const delivery = await Delivery.findById(id);
    if (!delivery) return errorResponse('Delivery not found', 404);

    if (amountPaid !== undefined) {
      const addedPaid = Number(amountPaid) - delivery.amountPaid;
      delivery.amountPaid = Number(amountPaid);
      if (addedPaid > 0) {
        await Shop.findByIdAndUpdate(delivery.shop, {
          $inc: { outstandingBalance: -addedPaid, totalPaidAmount: addedPaid },
        });
      }
    }

    if (paymentStatus) delivery.paymentStatus = paymentStatus;
    await delivery.save();

    return successResponse(delivery, 'Delivery updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update delivery', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const delivery = await Delivery.findByIdAndDelete(id);
    if (!delivery) return errorResponse('Delivery not found', 404);

    return successResponse(null, 'Delivery deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete delivery', 500);
  }
}
