import { Router, Request, Response } from 'express';
import Inventory from '../models/Inventory';
import Material from '../models/Material';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

// GET all inventory items with procurement tracking
router.get('/', async (req: Request, res: Response) => {
  try {
    // Clean up any legacy dummy mock inventory items if present
    await Inventory.deleteMany({
      itemName: {
        $in: [
          'Green Moong Beans (Organic)',
          'Fresh Organic Sprouts (Packed)',
          'Stand-up Packaging Pouches (200g)',
        ],
      },
    });

    let items = await Inventory.find().sort({ itemName: 1 });
    const materials = await Material.find().populate('supplier').sort({ purchaseDate: -1, createdAt: -1 });

    // Ensure all actual purchased materials are represented in Inventory SKUs
    for (const mat of materials) {
      let invType: 'raw_material' | 'packaging' | 'finished_sprout' = 'raw_material';
      const cat = (mat.category || '').toLowerCase();
      if (cat.includes('pack') || cat.includes('box') || cat.includes('pouch') || cat.includes('sticker')) {
        invType = 'packaging';
      }

      const match = items.find(
        (it) => it.itemName.toLowerCase().trim() === mat.name.toLowerCase().trim()
      );
      if (!match) {
        const createdInv = await Inventory.create({
          itemName: mat.name.trim(),
          type: invType,
          quantity: mat.quantity || 0,
          unit: mat.unit || 'kg',
          minThreshold: mat.minStockAlert || 10,
          valuationPerUnit: mat.purchasePrice || 0,
          location: 'Main Store',
        });
        items.push(createdInv);
      } else if (match.type !== invType && invType === 'packaging') {
        match.type = 'packaging';
        await match.save();
      }
    }

    // Compute comprehensive procurement tracking stats
    let totalProcuredCost = 0;
    let rawBeanCost = 0;
    let rawBeanQuantity = 0;
    let packagingCost = 0;
    let packagingQuantity = 0;

    const itemWiseProcurement: Record<
      string,
      {
        itemName: string;
        category: string;
        unit: string;
        totalQuantity: number;
        totalSpent: number;
        avgPrice: number;
        purchaseCount: number;
        lastPurchasedDate: string;
      }
    > = {};

    materials.forEach((mat: any) => {
      const qty = Number(mat.quantity || 0);
      const price = Number(mat.purchasePrice || 0);
      const totalAmount = qty * price;
      totalProcuredCost += totalAmount;

      const cat = mat.category || 'Raw Bean';
      const catLower = cat.toLowerCase();
      if (catLower.includes('raw') || catLower.includes('bean') || catLower.includes('grain')) {
        rawBeanCost += totalAmount;
        rawBeanQuantity += qty;
      } else if (
        catLower.includes('pack') ||
        catLower.includes('box') ||
        catLower.includes('pouch') ||
        catLower.includes('sticker')
      ) {
        packagingCost += totalAmount;
        packagingQuantity += qty;
      }

      const key = mat.name.trim();
      if (!itemWiseProcurement[key]) {
        itemWiseProcurement[key] = {
          itemName: key,
          category: cat,
          unit: mat.unit || 'kg',
          totalQuantity: 0,
          totalSpent: 0,
          avgPrice: 0,
          purchaseCount: 0,
          lastPurchasedDate: mat.purchaseDate || mat.createdAt,
        };
      }
      itemWiseProcurement[key].totalQuantity += qty;
      itemWiseProcurement[key].totalSpent += totalAmount;
      itemWiseProcurement[key].purchaseCount += 1;
      itemWiseProcurement[key].avgPrice = Math.round(
        itemWiseProcurement[key].totalSpent / (itemWiseProcurement[key].totalQuantity || 1)
      );
    });

    return successResponse(res, {
      items,
      purchasedMaterials: materials,
      procurementStats: {
        totalProcuredCost,
        totalPurchasesCount: materials.length,
        rawBeanCost,
        rawBeanQuantity,
        packagingCost,
        packagingQuantity,
        itemWiseSummary: Object.values(itemWiseProcurement),
      },
    });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error fetching inventory', 500);
  }
});

// CREATE new inventory item
router.post('/', async (req: Request, res: Response) => {
  try {
    const { itemName, type, quantity, unit, minThreshold, valuationPerUnit, location } = req.body;

    if (!itemName) {
      return errorResponse(res, 'Item name is required', 400);
    }

    const newItem = await Inventory.create({
      itemName,
      type: type || 'raw_material',
      quantity: Number(quantity) || 0,
      unit: unit || 'kg',
      minThreshold: Number(minThreshold) || 10,
      valuationPerUnit: Number(valuationPerUnit) || 0,
      location: location || 'Main Store',
    });

    return successResponse(res, newItem, 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error creating inventory item', 500);
  }
});

// UPDATE inventory item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return errorResponse(res, 'Inventory item not found', 404);
    }
    return successResponse(res, updated);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error updating inventory item', 500);
  }
});

// DELETE single inventory item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return errorResponse(res, 'Inventory item not found', 404);
    }
    return successResponse(res, { message: 'Item deleted successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error deleting inventory item', 500);
  }
});

// DELETE all inventory items
router.delete('/', async (req: Request, res: Response) => {
  try {
    await Inventory.deleteMany({});
    return successResponse(res, { message: 'All inventory items cleared successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error clearing inventory', 500);
  }
});

export default router;
