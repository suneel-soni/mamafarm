import { Router, Request, Response } from 'express';
import Material from '../models/Material';
import Supplier from '../models/Supplier';
import Inventory from '../models/Inventory';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const materials = await Material.find().populate('supplier').sort({ createdAt: -1 });
    return successResponse(res, materials);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching materials', 500);
  }
});

router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { filter, startDate, endDate } = req.query;
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    if (filter === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (filter === 'yesterday') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
    } else if (filter === 'this_week') {
      const day = now.getDay() || 7;
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1, 0, 0, 0, 0);
    } else if (filter === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (filter === 'custom' && startDate) {
      start = new Date(startDate as string);
      if (endDate) {
        const eDate = new Date(endDate as string);
        end = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate(), 23, 59, 59, 999);
      }
    }

    const query: any = {};
    if (start || end) {
      const dateCond: any = {};
      if (start) dateCond.$gte = start;
      if (end) dateCond.$lte = end;

      query.$or = [
        { purchaseDate: dateCond },
        { purchaseDate: { $exists: false }, createdAt: dateCond },
      ];
    }

    const materials = await Material.find(query).populate('supplier').sort({ purchaseDate: -1, createdAt: -1 });

    let totalPurchaseCost = 0;
    let rawBeanCost = 0;
    let rawBeanQuantity = 0;
    let rawBeanCount = 0;

    let packagingCost = 0;
    let packagingQuantity = 0;
    let packagingCount = 0;

    let otherCost = 0;
    let otherCount = 0;

    const categoryTotals: Record<string, { category: string; totalCost: number; itemsCount: number; totalQuantity: number }> = {
      'Raw Bean': { category: 'Raw Bean', totalCost: 0, itemsCount: 0, totalQuantity: 0 },
      'Packaging': { category: 'Packaging', totalCost: 0, itemsCount: 0, totalQuantity: 0 },
      'Chemicals/Cleaning': { category: 'Chemicals/Cleaning', totalCost: 0, itemsCount: 0, totalQuantity: 0 },
      'Other': { category: 'Other', totalCost: 0, itemsCount: 0, totalQuantity: 0 },
    };

    const groupedMap: Record<string, { date: string; timestamp: number; totalCost: number; materials: any[] }> = {};

    materials.forEach((mat: any) => {
      const qty = mat.quantity || 0;
      const itemCost = (mat.purchasePrice || 0) * qty;
      totalPurchaseCost += itemCost;

      const cat = mat.category || 'Other';
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { category: cat, totalCost: 0, itemsCount: 0, totalQuantity: 0 };
      }
      categoryTotals[cat].totalCost += itemCost;
      categoryTotals[cat].itemsCount += 1;
      categoryTotals[cat].totalQuantity += qty;

      if (cat === 'Raw Bean') {
        rawBeanCost += itemCost;
        rawBeanQuantity += qty;
        rawBeanCount += 1;
      } else if (cat === 'Packaging') {
        packagingCost += itemCost;
        packagingQuantity += qty;
        packagingCount += 1;
      } else {
        otherCost += itemCost;
        otherCount += 1;
      }

      const d = new Date(mat.purchaseDate || mat.createdAt || Date.now());
      const dateKey = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
      const timestamp = d.getTime();

      if (!groupedMap[dateKey]) {
        groupedMap[dateKey] = {
          date: dateKey,
          timestamp,
          totalCost: 0,
          materials: [],
        };
      }
      groupedMap[dateKey].totalCost += itemCost;
      groupedMap[dateKey].materials.push(mat);
    });

    const groupedSummary = Object.values(groupedMap).sort((a, b) => b.timestamp - a.timestamp);

    return successResponse(res, {
      totalPurchaseCost,
      numberOfPurchases: materials.length,
      rawBeanStats: {
        totalCost: rawBeanCost,
        totalQuantity: rawBeanQuantity,
        count: rawBeanCount,
        primaryUnit: 'kg',
      },
      packagingStats: {
        totalCost: packagingCost,
        totalQuantity: packagingQuantity,
        count: packagingCount,
        primaryUnit: 'pcs',
      },
      categoryBreakdown: Object.values(categoryTotals),
      groupedSummary,
      materials,
    });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching materials summary', 500);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.name || body.purchasePrice === undefined) {
      return errorResponse(res, 'Material name and purchase price are required', 400);
    }

    const newMaterial = await Material.create(body);

    if (body.supplier) {
      const itemTotal = (body.purchasePrice || 0) * (body.quantity || 0);
      const supplier = await Supplier.findById(body.supplier);
      if (supplier) {
        supplier.totalPurchased += itemTotal;
        if (body.paymentStatus === 'pending') {
          supplier.pendingPayment += itemTotal;
        }
        await supplier.save();
      }
    }

    // Automatically sync purchase with Inventory matrix
    try {
      let invType: 'raw_material' | 'packaging' | 'finished_sprout' = 'raw_material';
      const cat = (newMaterial.category || '').toLowerCase();
      if (cat.includes('pack') || cat.includes('box') || cat.includes('pouch') || cat.includes('sticker')) {
        invType = 'packaging';
      } else if (cat.includes('sprout') && !cat.includes('bean') && !cat.includes('grain')) {
        invType = 'finished_sprout';
      }

      const existingInv = await Inventory.findOne({
        itemName: { $regex: new RegExp(`^${newMaterial.name.trim()}$`, 'i') },
      });

      if (existingInv) {
        existingInv.quantity = (existingInv.quantity || 0) + (Number(newMaterial.quantity) || 0);
        existingInv.valuationPerUnit = Number(newMaterial.purchasePrice) || existingInv.valuationPerUnit;
        existingInv.unit = newMaterial.unit || existingInv.unit;
        if (newMaterial.minStockAlert) existingInv.minThreshold = newMaterial.minStockAlert;
        await existingInv.save();
      } else {
        await Inventory.create({
          itemName: newMaterial.name.trim(),
          type: invType,
          quantity: Number(newMaterial.quantity) || 0,
          unit: newMaterial.unit || 'kg',
          minThreshold: Number(newMaterial.minStockAlert) || 10,
          valuationPerUnit: Number(newMaterial.purchasePrice) || 0,
          location: 'Main Store',
        });
      }
    } catch (syncErr) {
      console.error('Inventory sync error on material purchase:', syncErr);
    }

    return successResponse(res, newMaterial, 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error adding material', 500);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id).populate('supplier');
    if (!material) return errorResponse(res, 'Material not found', 404);

    return successResponse(res, material);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching material', 500);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedMaterial = await Material.findByIdAndUpdate(id, body, { new: true });
    if (!updatedMaterial) return errorResponse(res, 'Material not found', 404);

    return successResponse(res, updatedMaterial);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error updating material', 500);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id);
    if (!deletedMaterial) return errorResponse(res, 'Material not found', 404);

    return successResponse(res, { message: 'Material deleted successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error deleting material', 500);
  }
});

export default router;
