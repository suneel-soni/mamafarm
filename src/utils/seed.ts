import User from '../models/User';
import Supplier from '../models/Supplier';
import Material from '../models/Material';
import Inventory from '../models/Inventory';
import Shop from '../models/Shop';
import Delivery from '../models/Delivery';
import ActivityLog from '../models/ActivityLog';
import Settings from '../models/Settings';
import bcrypt from 'bcryptjs';

export const seedData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Suraj@7264', salt);

    // 1. Ensure Owner User with phone 8130188878 exists
    await User.findOneAndUpdate(
      { phone: '8130188878' },
      {
        name: 'MamaFarm Owner',
        email: '8130188878@mamafarm.com',
        password: hashedPassword,
        role: 'admin',
        phone: '8130188878',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const userCount = await User.countDocuments();
    if (userCount > 1) {
      console.log('Database already populated. Skipping full seed.');
      return;
    }

    console.log('Seeding initial MamaFarm data...');

    // 2. Settings
    await Settings.create({
      businessName: 'MamaFarm Organic Sprouts',
      phone: '+91 81301 88878',
      email: 'contact@mamafarm.com',
      address: 'Plot 42, Green Agro Food Park, New Delhi',
      gstNumber: '07AAACM1234F1Z9',
    });

    // 3. Suppliers
    const supplier1 = await Supplier.create({
      name: 'Agro Pulse Traders',
      contactPerson: 'Ramesh Kumar',
      phone: '+91 9811223344',
      email: 'ramesh@agropulses.com',
      address: 'Grain Market Yard, Shop 14, Delhi',
      gstNumber: '07AGROP1234A1Z1',
      totalPurchased: 45000,
      pendingPayment: 5000,
    });

    const supplier2 = await Supplier.create({
      name: 'EcoPack Containers Ltd',
      contactPerson: 'Anil Gupta',
      phone: '+91 9899887766',
      email: 'sales@ecopack.com',
      address: 'Industrial Area Phase 2, Noida',
      gstNumber: '09ECOPK5678B2Z4',
      totalPurchased: 12000,
      pendingPayment: 0,
    });

    // 4. Raw Materials
    await Material.create({
      name: 'Raw Green Moong Grain',
      category: 'Raw Bean',
      supplier: supplier1._id,
      quantity: 250,
      unit: 'kg',
      purchasePrice: 95,
      gstPercent: 5,
      minStockAlert: 50,
      paymentStatus: 'partial',
    });

    await Material.create({
      name: 'Desi Brown Chana Grain',
      category: 'Raw Bean',
      supplier: supplier1._id,
      quantity: 180,
      unit: 'kg',
      purchasePrice: 75,
      gstPercent: 5,
      minStockAlert: 40,
      paymentStatus: 'paid',
    });

    await Material.create({
      name: 'Sprout Pouches',
      category: 'Packaging',
      supplier: supplier2._id,
      quantity: 2000,
      unit: 'pcs',
      purchasePrice: 1.5,
      gstPercent: 12,
      minStockAlert: 300,
      paymentStatus: 'paid',
    });

    // 5. Inventory Items
    await Inventory.create([
      { itemName: 'Green Moong Grain', type: 'raw_material', quantity: 250, unit: 'kg', minThreshold: 50, valuationPerUnit: 95 },
      { itemName: 'Brown Chana Grain', type: 'raw_material', quantity: 180, unit: 'kg', minThreshold: 40, valuationPerUnit: 75 },
      { itemName: 'Moong Sprouts', type: 'finished_sprout', quantity: 450, unit: 'packets', minThreshold: 100, valuationPerUnit: 25 },
      { itemName: 'Chana Sprouts', type: 'finished_sprout', quantity: 300, unit: 'packets', minThreshold: 80, valuationPerUnit: 20 },
      { itemName: 'Mixed Sprouts', type: 'finished_sprout', quantity: 200, unit: 'packets', minThreshold: 50, valuationPerUnit: 30 },
      { itemName: 'Sprout Pouches', type: 'packaging', quantity: 2000, unit: 'pcs', minThreshold: 300, valuationPerUnit: 1.5 },
    ]);

    // 6. Shops / Clients
    const shop1 = await Shop.create({
      shopName: 'Fresh Veggies Mart',
      ownerName: 'Suresh Patel',
      phone: '+91 9810012345',
      address: 'Shop 12, Sector 18 Market, Noida',
      area: 'Noida Sector 18',
      gstNumber: '09FRESH1234C1Z3',
      outstandingBalance: 1800,
      totalDeliveredValue: 8500,
      totalPaidAmount: 6700,
    });

    const shop2 = await Shop.create({
      shopName: 'Green Grocery Hub',
      ownerName: 'Vikram Singh',
      phone: '+91 9871122334',
      address: 'Main Market, Connaught Place, New Delhi',
      area: 'Central Delhi',
      gstNumber: '07GREEN5678D1Z2',
      outstandingBalance: 3200,
      totalDeliveredValue: 12400,
      totalPaidAmount: 9200,
    });

    await Shop.create({
      shopName: 'Organic Life Supermarket',
      ownerName: 'Neha Sharma',
      phone: '+91 9955443322',
      address: 'Galleria Market, Gurugram',
      area: 'Gurugram',
      gstNumber: '06ORGAN9012E1Z8',
      outstandingBalance: 0,
      totalDeliveredValue: 15600,
      totalPaidAmount: 15600,
    });

    // 7. Deliveries
    await Delivery.create({
      deliveryNumber: 'DEL-2026-001',
      shop: shop1._id,
      shopName: shop1.shopName,
      deliveryDate: new Date(Date.now() - 86400000 * 2),
      items: [
        { sproutType: 'Moong Sprouts', quantity: 50, unit: 'packets', rate: 25, amount: 1250 },
        { sproutType: 'Chana Sprouts', quantity: 30, unit: 'packets', rate: 20, amount: 600 },
      ],
      subTotal: 1850,
      discount: 50,
      netAmount: 1800,
      amountPaid: 0,
      paymentStatus: 'unpaid',
      deliveryPerson: 'Raju (Driver)',
    });

    await Delivery.create({
      deliveryNumber: 'DEL-2026-002',
      shop: shop2._id,
      shopName: shop2.shopName,
      deliveryDate: new Date(Date.now() - 86400000),
      items: [
        { sproutType: 'Moong Sprouts', quantity: 80, unit: 'packets', rate: 25, amount: 2000 },
        { sproutType: 'Mixed Sprouts', quantity: 40, unit: 'packets', rate: 30, amount: 1200 },
      ],
      subTotal: 3200,
      discount: 0,
      netAmount: 3200,
      amountPaid: 0,
      paymentStatus: 'unpaid',
      deliveryPerson: 'Raju (Driver)',
    });

    // 8. Activity Log
    await ActivityLog.create([
      { action: 'Database Seed', description: 'Initial MamaFarm database populated with owner account 8130188878.' },
    ]);

    console.log('MamaFarm Seed Completed Successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  }
};
