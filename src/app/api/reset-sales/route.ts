import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/db';
import Delivery from '@/models/Delivery';
import Payment from '@/models/Payment';
import ReturnOrder from '@/models/ReturnOrder';
import Shop from '@/models/Shop';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    await Delivery.deleteMany({});
    await Payment.deleteMany({});
    await ReturnOrder.deleteMany({});

    await Shop.updateMany({}, {
      $set: {
        outstandingBalance: 0,
        totalDeliveredValue: 0,
        totalPaidAmount: 0,
        totalDeliveredQuantity: 0,
        totalReturnedQuantity: 0,
        currentQuantity: 0,
      },
    });

    return successResponse({ reset: true }, 'Monthly sales, collections, deliveries, and payments successfully reset to zero.');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to reset sales data', 500);
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
