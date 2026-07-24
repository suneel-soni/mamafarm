import { connectToDatabase } from '@/lib/db';
import Delivery from '@/models/Delivery';
import Shop from '@/models/Shop';
import Supplier from '@/models/Supplier';
import Material from '@/models/Material';
import Expense from '@/models/Expense';
import Inventory from '@/models/Inventory';
import ActivityLog from '@/models/ActivityLog';
import { successResponse, errorResponse } from '@/helpers/response';

export async function GET() {
  try {
    await connectToDatabase();

    const deliveries = await Delivery.find();
    const totalRevenue = deliveries.reduce((sum, d) => sum + (d.netAmount || 0), 0);
    const totalCollected = deliveries.reduce((sum, d) => sum + (d.amountPaid || 0), 0);

    const shops = await Shop.find({ isActive: true });
    const totalShopDues = shops.reduce((sum, s) => {
      const due = Math.max(0, (s.totalDeliveredValue || 0) - (s.totalPaidAmount || 0));
      return sum + due;
    }, 0);

    const suppliers = await Supplier.find();
    const totalSupplierDues = suppliers.reduce((sum, s) => sum + (s.pendingPayment || 0), 0);

    const materials = await Material.find();
    const totalMaterialCost = materials.reduce((sum, m) => sum + (m.quantity * m.purchasePrice), 0);

    const expenses = await Expense.find();
    const totalOperatingExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const netProfit = totalRevenue - totalMaterialCost - totalOperatingExpense;

    const inventoryItems = await Inventory.find();
    const sproutsStock = inventoryItems
      .filter((i) => i.type === 'finished_sprout')
      .reduce((sum, i) => sum + i.quantity, 0);

    const lowStockItems = inventoryItems.filter((i) => i.quantity <= i.minThreshold);

    const recentActivities = await ActivityLog.find().sort({ timestamp: -1 }).limit(8);

    const chartData = [
      { month: 'Jan', revenue: 24000, expense: 12000, production: 1200 },
      { month: 'Feb', revenue: 32000, expense: 15000, production: 1500 },
      { month: 'Mar', revenue: 28000, expense: 14000, production: 1400 },
      { month: 'Apr', revenue: 41000, expense: 18000, production: 1900 },
      { month: 'May', revenue: 38000, expense: 16500, production: 1750 },
      { month: 'Jun', revenue: 45000, expense: 19000, production: 2100 },
      { month: 'Jul', revenue: Math.max(totalRevenue, 36500), expense: totalOperatingExpense, production: 1880 },
    ];

    return successResponse({
      kpis: {
        totalRevenue,
        totalCollected,
        netProfit,
        totalShopDues,
        totalSupplierDues,
        totalMaterialCost,
        totalOperatingExpense,
        sproutsStock,
        lowStockAlertsCount: lowStockItems.length,
      },
      lowStockItems,
      chartData,
      recentActivities,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Error fetching dashboard summary', 500);
  }
}
