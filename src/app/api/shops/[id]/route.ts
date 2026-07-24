import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Shop from '@/models/Shop';
import Delivery from '@/models/Delivery';
import ReturnOrder from '@/models/ReturnOrder';
import Payment from '@/models/Payment';
import { successResponse, errorResponse } from '@/helpers/response';

function validateImageSize(imageString?: string) {
  if (imageString && typeof imageString === 'string' && imageString.startsWith('data:image')) {
    const sizeInBytes = Math.round((imageString.length * 3) / 4);
    const sizeInKb = Math.round(sizeInBytes / 1024);
    if (sizeInKb > 105) {
      throw new Error(`Shop photo size (${sizeInKb}KB) exceeds the 100KB limit. Please upload a compressed photo.`);
    }
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    let shop;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      shop = await Shop.findById(id);
    } else {
      shop = await Shop.findOne({ shopCode: id.toUpperCase() });
    }

    if (!shop) {
      return errorResponse('Shop partner not found', 404);
    }

    const shopMongoId = shop._id.toString();

    const deliveries = await Delivery.find({ shop: shopMongoId }).sort({ deliveryDate: -1 });
    const returns = await ReturnOrder.find({ shop: shopMongoId }).sort({ returnDate: -1 });
    const payments = await Payment.find({ shop: shopMongoId, entityType: 'shop' }).sort({ paymentDate: -1 });

    const totalDeliveredQty = deliveries.reduce((acc, d) => {
      return acc + (d.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    }, 0);

    const totalReturnedQty = returns.reduce((acc, r) => {
      return acc + (r.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    }, 0);

    const currentQuantity = Math.max(0, totalDeliveredQty - totalReturnedQty);

    const totalDeliveredValue = deliveries.reduce((acc, d) => acc + (d.netAmount || 0), 0);
    const totalPaidAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalReturnedValue = returns.reduce((acc, r) => acc + (r.totalRefundAmount || 0), 0);

    const pendingPayment = Math.max(0, totalDeliveredValue - totalPaidAmount - totalReturnedValue);

    const salesByDateMap: Record<string, { date: string; amount: number; quantity: number }> = {};
    deliveries.forEach((d) => {
      const dateKey = new Date(d.deliveryDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      });
      if (!salesByDateMap[dateKey]) {
        salesByDateMap[dateKey] = { date: dateKey, amount: 0, quantity: 0 };
      }
      salesByDateMap[dateKey].amount += d.netAmount || 0;
      salesByDateMap[dateKey].quantity += (d.items || []).reduce((sum: number, it: any) => sum + it.quantity, 0);
    });

    const salesGraph = Object.values(salesByDateMap).reverse();

    const ledgerEntries: any[] = [];

    deliveries.forEach((d) => {
      ledgerEntries.push({
        timestamp: new Date(d.deliveryDate).getTime(),
        date: new Date(d.deliveryDate).toLocaleDateString('en-IN'),
        type: 'delivery',
        reference: d.deliveryNumber,
        description: `Sprouts Dispatch (${d.items.length} items)`,
        debit: d.netAmount,
        credit: 0,
      });
    });

    payments.forEach((p) => {
      ledgerEntries.push({
        timestamp: new Date(p.paymentDate).getTime(),
        date: new Date(p.paymentDate).toLocaleDateString('en-IN'),
        type: 'payment',
        reference: p.paymentNumber,
        description: `Payment Received (${p.paymentMethod.toUpperCase()})`,
        debit: 0,
        credit: p.amount,
      });
    });

    returns.forEach((r) => {
      ledgerEntries.push({
        timestamp: new Date(r.returnDate).getTime(),
        date: new Date(r.returnDate).toLocaleDateString('en-IN'),
        type: 'return',
        reference: r.returnNumber,
        description: `Order Return (${r.reason})`,
        debit: 0,
        credit: r.totalRefundAmount,
      });
    });

    ledgerEntries.sort((a, b) => a.timestamp - b.timestamp);

    let runningBalance = 0;
    const ledger = ledgerEntries
      .map((entry) => {
        runningBalance += entry.debit - entry.credit;
        return {
          ...entry,
          balance: Math.max(0, runningBalance),
        };
      })
      .reverse();

    const shopData = {
      ...shop.toObject(),
      currentQuantity,
      outstandingBalance: pendingPayment,
      totalDeliveredQuantity: totalDeliveredQty,
      totalReturnedQuantity: totalReturnedQty,
      totalDeliveredValue,
      totalPaidAmount,
    };

    return successResponse({
      shop: shopData,
      summary: {
        totalDeliveredQty,
        totalReturnedQty,
        currentQuantity,
        totalDeliveredValue,
        totalPaidAmount,
        pendingPayment,
      },
      salesGraph,
      recentOrders: deliveries.slice(0, 10),
      recentReturns: returns.slice(0, 10),
      ledger,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching shop details', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    validateImageSize(body.image);

    const shop = await Shop.findByIdAndUpdate(id, body, { new: true });
    return successResponse(shop, 'Shop updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update shop', 400);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    await Shop.findByIdAndUpdate(id, { isActive: false });
    return successResponse(null, 'Shop partner deactivated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete shop', 500);
  }
}
