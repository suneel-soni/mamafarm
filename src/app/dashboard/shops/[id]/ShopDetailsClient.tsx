'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { shopsAPI, deliveriesAPI, returnsAPI } from '@/services/api';
import {
  MapPin,
  Phone,
  ArrowLeft,
  Plus,
  RotateCcw,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ShopDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const shopId = (params?.id as string) || '';

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [sproutType, setSproutType] = useState('Moong Sprouts (200g)');
  const [orderQty, setOrderQty] = useState(50);
  const [orderRate, setOrderQtyRate] = useState(25);
  const [amountPaid, setAmountPaid] = useState(0);

  const [returnSproutType, setReturnSproutType] = useState('Moong Sprouts (200g)');
  const [returnQty, setReturnQty] = useState(10);
  const [returnRate, setReturnRate] = useState(25);
  const [returnReason, setReturnReason] = useState('Unsold / Expired Return');

  const loadShopDetails = async () => {
    setLoading(true);
    try {
      const res = await shopsAPI.getById(shopId);
      if (res.success && res.data) {
        setDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) loadShopDetails();
  }, [shopId]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        shopId,
        deliveryDate: new Date().toISOString(),
        items: [
          {
            sproutType,
            quantity: Number(orderQty),
            unit: 'packets',
            rate: Number(orderRate),
            amount: Number(orderQty) * Number(orderRate),
          },
        ],
        discount: 0,
        amountPaid: Number(amountPaid),
      };

      const res = await deliveriesAPI.create(payload);
      if (res.success) {
        setToast('New Order Dispatched!');
        setOrderModalOpen(false);
        loadShopDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturnOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        shopId,
        reason: returnReason,
        items: [
          {
            sproutType: returnSproutType,
            quantity: Number(returnQty),
            unit: 'packets',
            rate: Number(returnRate),
            amount: Number(returnQty) * Number(returnRate),
          },
        ],
      };

      const res = await returnsAPI.create(payload);
      if (res.success) {
        setToast('Return Recorded!');
        setReturnModalOpen(false);
        loadShopDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-slate-400 text-xs">Loading shop details...</div>
      </DashboardLayout>
    );
  }

  // Normalize shop details from Atlas DB response vs nested fallback structure
  const shop = details?.shop || (details?._id || details?.shopName ? details : null);

  if (!shop) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-slate-400 text-xs space-y-3">
          <p>Shop details not found or shop ID invalid.</p>
          <button
            onClick={() => router.push('/dashboard/shops')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
          >
            Back to Shops
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const summary = details?.summary || {
    totalDeliveredQty: shop.totalDeliveredQuantity || 0,
    totalReturnedQty: shop.totalReturnedQuantity || 0,
    currentQuantity: shop.currentQuantity || (shop.totalDeliveredQuantity || 0) - (shop.totalReturnedQuantity || 0),
    pendingPayment: shop.outstandingBalance || 0,
  };

  const salesGraph = details?.salesGraph || [
    { date: 'Jul 15', amount: shop.totalDeliveredValue || 2400 },
    { date: 'Jul 18', amount: (shop.totalDeliveredValue || 2400) * 0.8 },
    { date: 'Jul 22', amount: shop.totalDeliveredValue || 3200 },
  ];

  const ledger = details?.ledger || (details?.deliveryHistory ? details.deliveryHistory.map((d: any) => ({
    date: new Date(d.deliveryDate || d.createdAt).toLocaleDateString('en-IN'),
    type: 'delivery',
    reference: d.deliveryNumber || 'DEL-2026',
    description: `Dispatched ${d.items?.map((i: any) => `${i.quantity} ${i.sproutType}`).join(', ') || 'Sprouts'}`,
    debit: d.netAmount || 0,
    credit: d.amountPaid || 0,
    balance: (d.netAmount || 0) - (d.amountPaid || 0),
  })) : []);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 max-w-xs w-full text-xs">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-semibold truncate">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back Link */}
        <button
          onClick={() => router.push('/dashboard/shops')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shops
        </button>

        {/* Shop Mobile Header Card */}
        <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl overflow-hidden shadow-lg p-3.5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
              <img
                src={
                  shop?.image ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'
                }
                alt={shop?.shopName || 'Shop'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded-full text-[9px] font-bold uppercase">
                  Retail Partner
                </span>
                <span className="px-2 py-0.5 bg-slate-800 text-emerald-300 border border-emerald-800/40 rounded-full text-[9px] font-bold font-mono">
                  {shop?.shopCode || 'SHOP-101'}
                </span>
              </div>
              <h1 className="text-sm font-bold text-white truncate mt-1">{shop?.shopName}</h1>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" /> {shop?.address || shop?.area || 'Market'}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400 shrink-0" /> {shop?.phone || '+91 Contact'}
              </p>
            </div>
          </div>

          {/* Quick Action Mobile Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-900/30">
            <button
              onClick={() => setOrderModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-900/30"
            >
              <Plus className="w-3.5 h-3.5" /> Dispatch Order
            </button>
            <button
              onClick={() => setReturnModalOpen(true)}
              className="bg-slate-800 text-rose-400 border border-rose-900/40 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Record Return
            </button>
          </div>
        </div>

        {/* 2-Column KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-3">
            <p className="text-[9px] text-slate-400 uppercase font-semibold">Current Quantity</p>
            <p className="text-base font-bold text-emerald-300 mt-0.5">{summary.currentQuantity} Packets</p>
            <p className="text-[8px] text-emerald-400 font-bold">Delivered - Returned</p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-3">
            <p className="text-[9px] text-slate-400 uppercase font-semibold">Pending Payment</p>
            <p className="text-base font-bold text-amber-400 mt-0.5">₹{(summary.pendingPayment || 0).toLocaleString('en-IN')}</p>
            <p className="text-[8px] text-amber-300 font-bold">Remaining Due</p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-2.5">
            <p className="text-[9px] text-slate-400 font-semibold">Total Delivered</p>
            <p className="text-xs font-bold text-emerald-400 mt-0.5">{summary.totalDeliveredQty} Packets</p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-2.5">
            <p className="text-[9px] text-slate-400 font-semibold">Total Returned</p>
            <p className="text-xs font-bold text-rose-400 mt-0.5">{summary.totalReturnedQty} Packets</p>
          </div>
        </div>

        {/* Historical Chart */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-3.5 shadow-md space-y-2">
          <h3 className="font-bold text-white text-xs">Dispatch Sales History</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesGraph}>
                <defs>
                  <linearGradient id="shopSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#059669', borderRadius: '10px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fill="url(#shopSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shop Account Mobile Ledger */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-3.5 shadow-md space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" /> Account Ledger
            </h3>
            <span className="text-[9px] text-slate-400 font-semibold">Running Balance</span>
          </div>

          <div className="space-y-2">
            {ledger.length === 0 ? (
              <p className="text-[10px] text-slate-500 py-3 text-center">No ledger entries yet.</p>
            ) : (
              ledger.map((entry: any, idx: number) => (
                <div key={idx} className="bg-slate-800/60 border border-emerald-900/30 rounded-xl p-2.5 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-[11px]">{entry.reference}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        entry.type === 'delivery'
                          ? 'bg-blue-950 text-blue-300'
                          : entry.type === 'payment'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">{entry.description}</p>
                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-emerald-900/20">
                    <span className="text-slate-400">{entry.date}</span>
                    <div className="flex gap-2 font-bold">
                      {entry.debit > 0 && <span className="text-blue-300">+₹{entry.debit}</span>}
                      {entry.credit > 0 && <span className="text-emerald-300">-₹{entry.credit}</span>}
                      <span className="text-amber-300">Bal: ₹{(entry.balance || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal: New Order */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0">
            <div className="bg-slate-900 border-t border-emerald-900/60 rounded-t-3xl w-full max-w-md p-5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-900/40 pb-2">
                <h3 className="text-xs font-bold text-emerald-400">Dispatch Order</h3>
                <button onClick={() => setOrderModalOpen(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 block mb-1">Sprout Packet Type</label>
                  <select
                    value={sproutType}
                    onChange={(e) => setSproutType(e.target.value)}
                    className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Moong Sprouts (200g)">Moong Sprouts (200g)</option>
                    <option value="Chana Sprouts (200g)">Chana Sprouts (200g)</option>
                    <option value="Mixed Sprouts (200g)">Mixed Sprouts (200g)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">Quantity (Pkts)</label>
                    <input
                      type="number"
                      value={orderQty}
                      onChange={(e) => setOrderQty(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">Rate (₹/Pkt)</label>
                    <input
                      type="number"
                      value={orderRate}
                      onChange={(e) => setOrderQtyRate(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-300 block mb-1">Cash Collected (₹)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-emerald-900/40">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold"
                  >
                    Dispatch Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Return Order */}
        {returnModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center p-0">
            <div className="bg-slate-900 border-t border-emerald-900/60 rounded-t-3xl w-full max-w-md p-5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-900/40 pb-2">
                <h3 className="text-xs font-bold text-rose-400">Record Order Return</h3>
                <button onClick={() => setReturnModalOpen(false)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReturnOrder} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 block mb-1">Sprout Packet Type</label>
                  <select
                    value={returnSproutType}
                    onChange={(e) => setReturnSproutType(e.target.value)}
                    className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Moong Sprouts (200g)">Moong Sprouts (200g)</option>
                    <option value="Chana Sprouts (200g)">Chana Sprouts (200g)</option>
                    <option value="Mixed Sprouts (200g)">Mixed Sprouts (200g)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">Returned Packets</label>
                    <input
                      type="number"
                      value={returnQty}
                      onChange={(e) => setReturnQty(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">Credit Rate (₹/Pkt)</label>
                    <input
                      type="number"
                      value={returnRate}
                      onChange={(e) => setReturnRate(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-300 block mb-1">Reason</label>
                  <input
                    type="text"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-slate-800 border border-emerald-900/40 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-emerald-900/40">
                  <button
                    type="button"
                    onClick={() => setReturnModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-bold"
                  >
                    Record Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
