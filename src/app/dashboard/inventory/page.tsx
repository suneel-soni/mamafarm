'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { inventoryAPI } from '@/services/api';
import { InventoryItem } from '@/types';
import { Boxes, AlertTriangle, ShieldCheck, Search, ArrowUpRight } from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryAPI.getAll();
      if (res.success) setInventory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const totalValuation = inventory.reduce((sum, item) => sum + item.quantity * (item.valuationPerUnit || 0), 0);
  const lowStockCount = inventory.filter((item) => item.quantity <= item.minThreshold).length;

  const filtered = inventory.filter(
    (item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Boxes className="w-7 h-7 text-emerald-400" />
              Real-time Inventory & Stock Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live tracking of raw beans, packaged sprouts, packaging pouches, low stock alerts and stock valuation.
            </p>
          </div>
        </div>

        {/* Overview KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-slate-400 font-medium mb-1">Total Stock Valuation</p>
            <p className="text-2xl font-bold text-emerald-400">₹{totalValuation.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-500 mt-1">Calculated from unit buy/procurement rates</p>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-slate-400 font-medium mb-1">Total Stock SKUs</p>
            <p className="text-2xl font-bold text-white">{inventory.length} Items</p>
            <p className="text-xs text-emerald-400 mt-1 font-medium">Raw, Finished & Packaging</p>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-slate-400 font-medium mb-1">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-amber-400">{lowStockCount} Items</p>
            <p className="text-xs text-amber-300 mt-1 font-medium">Requires replenishment</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stock by item name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-emerald-900/40 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-emerald-400 uppercase font-semibold text-[11px] border-b border-emerald-900/40">
                <tr>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Category Type</th>
                  <th className="p-4">Quantity In Hand</th>
                  <th className="p-4">Min Safety Alert</th>
                  <th className="p-4">Valuation / Unit</th>
                  <th className="p-4">Total Stock Value</th>
                  <th className="p-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/20">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Loading inventory levels...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No stock items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const isLow = item.quantity <= item.minThreshold;
                    const stockVal = item.quantity * (item.valuationPerUnit || 0);
                    return (
                      <tr key={item._id} className="hover:bg-emerald-900/10 transition-colors">
                        <td className="p-4 font-bold text-white">{item.itemName}</td>
                        <td className="p-4 uppercase text-slate-400 text-[10px] font-semibold">{item.type}</td>
                        <td className="p-4 font-bold text-emerald-300 text-sm">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="p-4 text-slate-400">
                          {item.minThreshold} {item.unit}
                        </td>
                        <td className="p-4 text-slate-300">₹{item.valuationPerUnit || 0}</td>
                        <td className="p-4 font-bold text-white">₹{stockVal.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-max ${
                              isLow
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {isLow ? (
                              <>
                                <AlertTriangle className="w-3 h-3 text-amber-400" /> Low Stock
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Healthy
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
