import { NextRequest } from 'next/server';
export const dynamic = 'force-static';
import { connectToDatabase } from '@/lib/db';
import ReturnOrder from '@/models/ReturnOrder';
import Shop from '@/models/Shop';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('shopId');

    const filter = shopId ? { shop: shopId } : {};
    const returns = await ReturnOrder.find(filter).sort({ returnDate: -1 });
    return successResponse(returns);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching return orders', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { shopId, deliveryId, items, reason, notes } = body;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return errorResponse('Shop partner not found', 404);
    }

    const returnNumber = 'RET-' + Date.now().toString().slice(-6);

    let totalRefundAmount = 0;
    let totalReturnQty = 0;

    const processedItems = (items || []).map((item: any) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const amount = qty * rate;
      totalRefundAmount += amount;
      totalReturnQty += qty;

      return {
        sproutType: item.sproutType,
        quantity: qty,
        unit: item.unit || 'packets',
        rate,
        amount,
      };
    });

    const returnOrder = await ReturnOrder.create({
      returnNumber,
      shop: shopId,
      shopName: shop.shopName,
      deliveryId,
      items: processedItems,
      totalRefundAmount,
      reason: reason || 'Unsold / Damaged Return',
      notes,
    });

    shop.totalReturnedQuantity = (shop.totalReturnedQuantity || 0) + totalReturnQty;
    shop.outstandingBalance = Math.max(0, (shop.outstandingBalance || 0) - totalRefundAmount);
    await shop.save();

    return successResponse(returnOrder, 'Return order created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create return order', 400);
  }
}
