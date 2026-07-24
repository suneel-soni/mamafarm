import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/db';
import Delivery from '@/models/Delivery';
import Shop from '@/models/Shop';
import Supplier from '@/models/Supplier';
import Material from '@/models/Material';
import Expense from '@/models/Expense';
import Production from '@/models/Production';
import Inventory from '@/models/Inventory';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const queryFilter: any = {};
    if (startDate && endDate) {
      queryFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const deliveries = await Delivery.find(queryFilter).populate('shop', 'shopName');
    const expenses = await Expense.find(queryFilter);
    const materials = await Material.find(queryFilter);
    const productions = await Production.find(queryFilter);
    const shops = await Shop.find();
    const suppliers = await Supplier.find();
    const inventory = await Inventory.find();

    const totalRevenue = deliveries.reduce((acc, d) => acc + d.netAmount, 0);
    const totalMaterialCost = materials.reduce((acc, m) => acc + m.quantity * m.purchasePrice, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalRevenue - totalMaterialCost - totalExpenses;

    const shopPerformance = shops.map((s) => ({
      shopName: s.shopName,
      totalDelivered: s.totalDeliveredValue,
      totalPaid: s.totalPaidAmount,
      outstanding: s.outstandingBalance,
    }));

    const supplierBreakdown = suppliers.map((sup) => ({
      supplierName: sup.name,
      totalPurchased: sup.totalPurchased,
      pendingPayment: sup.pendingPayment,
    }));

    return successResponse({
      summary: {
        totalRevenue,
        totalMaterialCost,
        totalExpenses,
        netProfit,
        deliveryCount: deliveries.length,
        productionBatchCount: productions.length,
      },
      profitAndLoss: {
        grossRevenue: totalRevenue,
        costOfGoodsSold: totalMaterialCost,
        operatingExpenses: totalExpenses,
        netProfitMargin: totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(2)) : 0,
      },
      shopPerformance,
      supplierBreakdown,
      inventoryStatus: inventory,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Error generating reports', 500);
  }
}
