import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Delivery from '@/models/Delivery';
import Shop from '@/models/Shop';
import Inventory from '@/models/Inventory';
import ActivityLog from '@/models/ActivityLog';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();
    const deliveries = await Delivery.find().populate('shop', 'shopName ownerName phone address image').sort({ deliveryDate: -1 });
    return successResponse(deliveries);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching deliveries', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { shopId, deliveryDate, items, discount, amountPaid, deliveryPerson, notes } = body;

    const shop = await Shop.findById(shopId);
    if (!shop) return errorResponse('Shop not found', 404);

    let subTotal = 0;
    let totalOrderQty = 0;

    const processedItems = (items || []).map((item: any) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const amt = qty * rate;
      subTotal += amt;
      totalOrderQty += qty;

      return {
        sproutType: item.sproutType,
        quantity: qty,
        unit: item.unit || 'packets',
        rate,
        amount: amt,
      };
    });

    const disc = Number(discount || 0);
    const netAmount = Math.max(0, subTotal - disc);
    const paid = Number(amountPaid || 0);
    const pendingAmount = netAmount - paid;

    let paymentStatus = 'unpaid';
    if (paid >= netAmount) paymentStatus = 'paid';
    else if (paid > 0) paymentStatus = 'partial';

    const count = await Delivery.countDocuments();
    const deliveryNumber = `DEL-2026-${String(count + 1).padStart(3, '0')}`;
    const dispatchDate = deliveryDate ? new Date(deliveryDate) : new Date();

    const delivery = await Delivery.create({
      deliveryNumber,
      shop: shopId,
      shopName: shop.shopName,
      deliveryDate: dispatchDate,
      items: processedItems,
      subTotal,
      discount: disc,
      netAmount,
      amountPaid: paid,
      paymentStatus,
      deliveryPerson: deliveryPerson || 'Self',
      notes,
    });

    await Shop.findByIdAndUpdate(shopId, {
      $inc: {
        totalDeliveredQuantity: totalOrderQty,
        outstandingBalance: pendingAmount,
        totalDeliveredValue: netAmount,
        totalPaidAmount: paid,
      },
      lastDeliveryDate: dispatchDate,
    });

    for (const item of processedItems) {
      await Inventory.findOneAndUpdate(
        { itemName: item.sproutType },
        { $inc: { quantity: -item.quantity } }
      );
    }

    await ActivityLog.create({
      action: 'Delivery Created',
      description: `Dispatched ${deliveryNumber} to ${shop.shopName} (Net: ₹${netAmount})`,
      entityType: 'Delivery',
      entityId: String(delivery._id),
    });

    return successResponse(delivery, 'Delivery dispatched successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to record delivery', 500);
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    const result = await Delivery.deleteMany({});
    return successResponse(
      { deletedCount: result.deletedCount },
      `Successfully deleted ${result.deletedCount} delivery records from database`
    );
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete delivery records', 500);
  }
}
