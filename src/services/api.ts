import axios from 'axios';
import {
  Material,
  Supplier,
  Shop,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Authorization Token if exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mamafarm_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  login: async (mobile: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { mobile, password });
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Login failed' };
    }
  },
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err: any) {
      return { success: false, message: 'Unauthorized' };
    }
  },
};

export const dashboardAPI = {
  getSummary: async () => {
    try {
      const res = await api.get('/dashboard');
      return res.data;
    } catch {
      return {
        success: false,
        data: {
          kpis: {
            totalRevenue: 0,
            totalCollected: 0,
            netProfit: 0,
            totalShopDues: 0,
            totalSupplierDues: 0,
            totalMaterialCost: 0,
            totalOperatingExpense: 0,
            sproutsStock: 0,
            lowStockAlertsCount: 0,
          },
          chartData: [],
          recentActivities: [],
        },
      };
    }
  },
  getSalesPerformance: async () => {
    try {
      const res = await api.get('/dashboard/sales');
      return res.data;
    } catch {
      return {
        success: false,
        data: {
          todaySales: 0,
          weeklySales: 0,
          monthlySales: 0,
          totalRevenue: 0,
          pendingCollection: 0,
          topPerformingShops: [],
          dailyGraph: [],
          monthlyGraph: [],
        },
      };
    }
  },
};

export const materialsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/materials');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  getSummary: async (params?: { filter?: string; startDate?: string; endDate?: string }) => {
    try {
      const res = await api.get('/materials/summary', { params });
      return res.data;
    } catch {
      return {
        success: false,
        data: {
          totalPurchaseCost: 0,
          numberOfPurchases: 0,
          averagePurchaseCost: 0,
          groupedSummary: [],
        },
      };
    }
  },
  create: async (data: Partial<Material>) => {
    try {
      const res = await api.post('/materials', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create material' };
    }
  },
  update: async (id: string, data: Partial<Material>) => {
    try {
      const res = await api.put(`/materials/${id}`, data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to update material' };
    }
  },
};

export const suppliersAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/suppliers');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  create: async (data: Partial<Supplier>) => {
    try {
      const res = await api.post('/suppliers', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create supplier' };
    }
  },
};

export const shopsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/shops');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  getById: async (id: string) => {
    try {
      const res = await api.get(`/shops/${id}`);
      return res.data;
    } catch {
      return {
        success: false,
        data: {
          shop: null,
          summary: { totalDeliveredQty: 0, totalReturnedQty: 0, currentQuantity: 0, pendingPayment: 0 },
          salesGraph: [],
          recentOrders: [],
          recentReturns: [],
          ledger: [],
        },
      };
    }
  },
  create: async (data: Partial<Shop>) => {
    try {
      const res = await api.post('/shops', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create shop' };
    }
  },
  update: async (id: string, data: Partial<Shop>) => {
    try {
      const res = await api.put(`/shops/${id}`, data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to update shop' };
    }
  },
};

export const deliveriesAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/deliveries');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  create: async (data: any) => {
    try {
      const res = await api.post('/deliveries', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create delivery' };
    }
  },
};

export const returnsAPI = {
  create: async (data: any) => {
    try {
      const res = await api.post('/returns', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to record return' };
    }
  },
  getAll: async (shopId?: string) => {
    try {
      const res = await api.get('/returns', { params: { shopId } });
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
};

export const paymentsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/payments');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  create: async (data: any) => {
    try {
      const res = await api.post('/payments', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to record payment' };
    }
  },
};

export const productionAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/production');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  create: async (data: any) => {
    try {
      const res = await api.post('/production', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create production batch' };
    }
  },
};

export const inventoryAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/inventory');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
};

export const expensesAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/expenses');
      return res.data;
    } catch {
      return { success: false, data: [] };
    }
  },
  create: async (data: any) => {
    try {
      const res = await api.post('/expenses', data);
      return res.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to record expense' };
    }
  },
};

export const reportsAPI = {
  getReports: async (params?: any) => {
    try {
      const res = await api.get('/reports', { params });
      return res.data;
    } catch {
      return {
        success: false,
        data: {
          summary: { totalRevenue: 0, totalMaterialCost: 0, totalExpenses: 0, netProfit: 0, deliveryCount: 0, productionBatchCount: 0 },
          profitAndLoss: { grossRevenue: 0, costOfGoodsSold: 0, operatingExpenses: 0, netProfitMargin: 0 },
          shopPerformance: [],
          supplierBreakdown: [],
          inventoryStatus: [],
        },
      };
    }
  },
};

export default api;

