import { connectToDatabase } from '@/lib/db';
export const dynamic = 'force-static';
import Delivery from '@/models/Delivery';
import Shop from '@/models/Shop';
import Supplier from '@/models/Supplier';
import Material from '@/models/Material';
import Expense from '@/models/Expense';
import Inventory from '@/models/Inventory';
import Production from '@/models/Production';
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

    const productions = await Production.find();

    const netProfit = totalRevenue - totalMaterialCost - totalOperatingExpense;

    const inventoryItems = await Inventory.find();
    const sproutsStock = inventoryItems
      .filter((i) => i.type === 'finished_sprout')
      .reduce((sum, i) => sum + i.quantity, 0);

    const lowStockItems = inventoryItems.filter((i) => i.quantity <= i.minThreshold);

    const recentActivities = await ActivityLog.find().sort({ timestamp: -1 }).limit(8);

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = now.getFullYear();

    const chartData = months.map((m, idx) => {
      const rev = deliveries
        .filter((d) => {
          const dt = new Date(d.deliveryDate || d.createdAt);
          return dt.getMonth() === idx && dt.getFullYear() === currentYear;
        })
        .reduce((sum, d) => sum + (d.netAmount || 0), 0);

      const exp = expenses
        .filter((e) => {
          const dt = new Date(e.expenseDate || e.createdAt);
          return dt.getMonth() === idx && dt.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      const prod = productions
        .filter((p) => {
          const dt = new Date(p.productionDate || p.createdAt);
          return dt.getMonth() === idx && dt.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + (p.batchSize || p.actualQuantity || 0), 0);

      return {
        month: m,
        revenue: rev,
        expense: exp,
        production: prod,
      };
    });

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
