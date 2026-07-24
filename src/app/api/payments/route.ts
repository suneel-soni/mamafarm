import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/db';
import Payment from '@/models/Payment';
import Shop from '@/models/Shop';
import Supplier from '@/models/Supplier';
import Delivery from '@/models/Delivery';
import ActivityLog from '@/models/ActivityLog';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();
    const payments = await Payment.find()
      .populate('shop', 'shopName')
      .populate('supplier', 'name')
      .sort({ paymentDate: -1 });
    return successResponse(payments);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching payments', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { entityType, shopId, supplierId, amount, paymentMethod, transactionRef, paymentDate, notes } = body;
    const payAmt = Number(amount || 0);

    if (payAmt <= 0) {
      return errorResponse('Payment amount must be greater than zero', 400);
    }

    const count = await Payment.countDocuments();
    const paymentNumber = `PAY-2026-${String(count + 1).padStart(3, '0')}`;

    let partyName = '';

    if (entityType === 'shop' && shopId) {
      const shop = await Shop.findById(shopId);
      if (!shop) return errorResponse('Shop not found', 404);
      partyName = shop.shopName;

      await Shop.findByIdAndUpdate(shopId, {
        $inc: { outstandingBalance: -payAmt, totalPaidAmount: payAmt },
      });

      // Auto-allocate payment to unpaid deliveries for this shop
      const unpaidDeliveries = await Delivery.find({
        shop: shopId,
        paymentStatus: { $ne: 'paid' },
      }).sort({ deliveryDate: 1 });

      let remainingToAllocate = payAmt;
      for (const del of unpaidDeliveries) {
        if (remainingToAllocate <= 0) break;
        const dueOnDel = (del.netAmount || 0) - (del.amountPaid || 0);
        if (dueOnDel > 0) {
          const allocate = Math.min(remainingToAllocate, dueOnDel);
          del.amountPaid = (del.amountPaid || 0) + allocate;
          if (del.amountPaid >= del.netAmount) {
            del.paymentStatus = 'paid';
          } else {
            del.paymentStatus = 'partial';
          }
          await del.save();
          remainingToAllocate -= allocate;
        }
      }
    } else if (entityType === 'supplier' && supplierId) {
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) return errorResponse('Supplier not found', 404);
      partyName = supplier.name;

      await Supplier.findByIdAndUpdate(supplierId, {
        $inc: { pendingPayment: -payAmt },
      });
    }

    const payment = await Payment.create({
      paymentNumber,
      entityType,
      shop: shopId || null,
      supplier: supplierId || null,
      partyName,
      amount: payAmt,
      paymentMethod: paymentMethod || 'cash',
      transactionRef: transactionRef || '',
      paymentDate: paymentDate || new Date(),
      notes: notes || '',
    });

    await ActivityLog.create({
      action: 'Payment Received/Made',
      description: `Recorded payment ${paymentNumber} of ₹${payAmt} for ${partyName}`,
      entityType: 'Payment',
      entityId: String(payment._id),
    });

    return successResponse(payment, 'Payment recorded successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to record payment', 500);
  }
}
