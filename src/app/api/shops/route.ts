import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/db';
import Shop from '@/models/Shop';
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

export async function GET() {
  try {
    await connectToDatabase();
    const shops = await Shop.find({ isActive: true }).sort({ createdAt: 1 });

    const formattedShops = await Promise.all(
      shops.map(async (s, index) => {
        const code = s.shopCode && s.shopCode.trim() !== '' ? s.shopCode : `SHOP-${101 + index}`;
        if (!s.shopCode || s.shopCode.trim() === '') {
          await Shop.findByIdAndUpdate(s._id, { shopCode: code });
        }

        const currentQuantity = Math.max(0, (s.totalDeliveredQuantity || 0) - (s.totalReturnedQuantity || 0));
        const remainingPayment = Math.max(0, (s.totalDeliveredValue || 0) - (s.totalPaidAmount || 0));

        return {
          _id: s._id,
          shopCode: code,
          shopName: s.shopName,
          ownerName: s.ownerName,
          phone: s.phone,
          address: s.address,
          area: s.area,
          gstNumber: s.gstNumber,
          image: s.image,
          currentQuantity,
          outstandingBalance: remainingPayment,
          totalDeliveredQuantity: s.totalDeliveredQuantity || 0,
          totalReturnedQuantity: s.totalReturnedQuantity || 0,
          totalDeliveredValue: s.totalDeliveredValue || 0,
          totalPaidAmount: s.totalPaidAmount || 0,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        };
      })
    );

    return successResponse(formattedShops);
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching shops', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    validateImageSize(body.image);

    if (!body.shopCode) {
      const count = await Shop.countDocuments();
      body.shopCode = `SHOP-${101 + count}`;
    }

    const shop = await Shop.create(body);
    return successResponse(shop, 'Shop created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create shop', 400);
  }
}
