import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
export const dynamic = 'force-static';
import Material from '@/models/Material';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'this_month';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let start = new Date(0);
    let end = new Date();

    const now = new Date();
    if (filter === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filter === 'yesterday') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filter === 'this_week') {
      const day = now.getDay() || 7;
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
    } else if (filter === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    const materials = await Material.find({
      $or: [
        { purchaseDate: { $gte: start, $lte: end } },
        { createdAt: { $gte: start, $lte: end } },
      ],
    })
      .populate('supplier', 'name phone')
      .sort({ purchaseDate: -1, createdAt: -1 });

    let totalPurchaseCost = 0;
    const count = materials.length;

    const groupedMap: Record<string, { date: string; materials: any[]; totalCost: number; count: number }> = {};

    materials.forEach((mat) => {
      const cost = Number(mat.quantity || 0) * Number(mat.purchasePrice || 0);
      totalPurchaseCost += cost;

      const d = mat.purchaseDate || mat.createdAt || new Date();
      const dateStr = new Date(d).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      if (!groupedMap[dateStr]) {
        groupedMap[dateStr] = {
          date: dateStr,
          materials: [],
          totalCost: 0,
          count: 0,
        };
      }

      groupedMap[dateStr].materials.push(mat);
      groupedMap[dateStr].totalCost += cost;
      groupedMap[dateStr].count += 1;
    });

    const averagePurchaseCost = count > 0 ? totalPurchaseCost / count : 0;
    const groupedSummary = Object.values(groupedMap);

    return successResponse({
      totalPurchaseCost,
      numberOfPurchases: count,
      averagePurchaseCost,
      groupedSummary,
      materials,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching material summary', 500);
  }
}
