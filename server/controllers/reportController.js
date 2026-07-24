const Delivery = require('../models/Delivery');
const Shop = require('../models/Shop');
const Supplier = require('../models/Supplier');
const Material = require('../models/Material');
const Expense = require('../models/Expense');
const Production = require('../models/Production');
const Inventory = require('../models/Inventory');

exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;

    const queryFilter = {};
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

    res.json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
