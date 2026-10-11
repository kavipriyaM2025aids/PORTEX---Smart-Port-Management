import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/port';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor for clear error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    console.error('API Error:', message, error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // 1. Contacts
  getContacts: async () => {
    const res = await api.get('/contacts');
    return res.data;
  },
  getContactById: async (id) => {
    const res = await api.get(`/contacts/${id}`);
    return res.data;
  },
  createContact: async (data) => {
    const res = await api.post('/contacts', data);
    return res.data;
  },
  deleteContact: async (id) => {
    const res = await api.delete(`/contacts/${id}`);
    return res.data;
  },

  // 2. Products
  getProducts: async () => {
    const res = await api.get('/products');
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  // 3. Gates
  getGates: async () => {
    const res = await api.get('/gates');
    return res.data;
  },
  getGateById: async (id) => {
    const res = await api.get(`/gates/${id}`);
    return res.data;
  },
  createGate: async (data) => {
    const res = await api.post('/gates', data);
    return res.data;
  },
  deleteGate: async (id) => {
    const res = await api.delete(`/gates/${id}`);
    return res.data;
  },

  // 4. Containers
  getContainers: async () => {
    const res = await api.get('/containers');
    return res.data;
  },
  getContainerById: async (id) => {
    const res = await api.get(`/containers/${id}`);
    return res.data;
  },
  createContainer: async (data) => {
    const res = await api.post('/containers', data);
    return res.data;
  },
  deleteContainer: async (id) => {
    const res = await api.delete(`/containers/${id}`);
    return res.data;
  },

  // 5. Gate In & Gate Entries
  processGateIn: async (data) => {
    const res = await api.post('/gate-in', data);
    return res.data;
  },
  getGateEntries: async () => {
    const res = await api.get('/gate-entries');
    return res.data;
  },
  getGateEntryById: async (id) => {
    const res = await api.get(`/gate-entries/${id}`);
    return res.data;
  },
  createGateEntry: async (data) => {
    const res = await api.post('/gate-entries', data);
    return res.data;
  },
  deleteGateEntry: async (id) => {
    const res = await api.delete(`/gate-entries/${id}`);
    return res.data;
  },

  // 6. Weighbridge Readings
  getWeighbridgeReadings: async () => {
    const res = await api.get('/weighbridge-readings');
    return res.data;
  },
  getWeighbridgeReadingById: async (id) => {
    const res = await api.get(`/weighbridge-readings/${id}`);
    return res.data;
  },
  createWeighbridgeReading: async ({ gateEntryId, deviceId, weight }) => {
    const res = await api.post('/weighbridge-readings', null, {
      params: { gateEntryId, deviceId, weight }
    });
    return res.data;
  },
  deleteWeighbridgeReading: async (id) => {
    const res = await api.delete(`/weighbridge-readings/${id}`);
    return res.data;
  },

  // 7. Sales Orders
  getSalesOrders: async () => {
    const res = await api.get('/sales-orders');
    return res.data;
  },
  getSalesOrderById: async (id) => {
    const res = await api.get(`/sales-orders/${id}`);
    return res.data;
  },
  createSalesOrder: async (data) => {
    const res = await api.post('/sales-orders', data);
    return res.data;
  },
  getSalesOrderItems: async () => {
    const res = await api.get('/sales-order-items');
    return res.data;
  },
  deleteSalesOrder: async (id) => {
    const res = await api.delete(`/sales-orders/${id}`);
    return res.data;
  },

  // 8. Customer Invoices
  getInvoices: async () => {
    const res = await api.get('/invoices');
    return res.data;
  },
  getInvoiceById: async (id) => {
    const res = await api.get(`/invoices/${id}`);
    return res.data;
  },
  createInvoice: async (salesOrderId) => {
    const res = await api.post('/invoices', null, {
      params: { salesOrderId }
    });
    return res.data;
  },
  getInvoiceItems: async () => {
    const res = await api.get('/invoice-items');
    return res.data;
  },
  deleteInvoice: async (id) => {
    const res = await api.delete(`/invoices/${id}`);
    return res.data;
  },

  // 9. Payments (Customer & Vendor)
  getPayments: async () => {
    const res = await api.get('/payments');
    return res.data;
  },
  getPaymentById: async (id) => {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },
  createCustomerPayment: async ({ invoiceId, amount, paymentMethod, referenceNumber }) => {
    const res = await api.post('/payments/customer', null, {
      params: { invoiceId, amount, paymentMethod, referenceNumber }
    });
    return res.data;
  },
  createVendorPayment: async ({ billId, amount, paymentMethod, referenceNumber }) => {
    const res = await api.post('/payments/vendor', null, {
      params: { billId, amount, paymentMethod, referenceNumber }
    });
    return res.data;
  },
  deletePayment: async (id) => {
    const res = await api.delete(`/payments/${id}`);
    return res.data;
  },
  deleteCustomerPayment: async (id) => {
    const res = await api.delete(`/payments/${id}`);
    return res.data;
  },
  deleteVendorPayment: async (id) => {
    const res = await api.delete(`/payments/${id}`);
    return res.data;
  },

  // 10. Purchase Orders
  getPurchaseOrders: async () => {
    const res = await api.get('/purchase-orders');
    return res.data;
  },
  getPurchaseOrderById: async (id) => {
    const res = await api.get(`/purchase-orders/${id}`);
    return res.data;
  },
  createPurchaseOrder: async ({ vendorId, productId }) => {
    const res = await api.post('/purchase-orders', null, {
      params: { vendorId, productId }
    });
    return res.data;
  },
  getPurchaseOrderItems: async () => {
    const res = await api.get('/purchase-order-items');
    return res.data;
  },
  deletePurchaseOrder: async (id) => {
    const res = await api.delete(`/purchase-orders/${id}`);
    return res.data;
  },

  // 11. Vendor Bills
  getVendorBills: async () => {
    const res = await api.get('/vendor-bills');
    return res.data;
  },
  getVendorBillById: async (id) => {
    const res = await api.get(`/vendor-bills/${id}`);
    return res.data;
  },
  createVendorBill: async (poId) => {
    const res = await api.post('/vendor-bills', null, {
      params: { poId }
    });
    return res.data;
  },
  deleteVendorBill: async (id) => {
    const res = await api.delete(`/vendor-bills/${id}`);
    return res.data;
  },

  // 12. Chart of Accounts & Journals
  getAccounts: async () => {
    const res = await api.get('/accounts');
    return res.data;
  },
  getAccountById: async (id) => {
    const res = await api.get(`/accounts/${id}`);
    return res.data;
  },
  deleteAccount: async (id) => {
    const res = await api.delete(`/accounts/${id}`);
    return res.data;
  },
  getJournals: async () => {
    const res = await api.get('/journals');
    return res.data;
  },
  getJournalById: async (id) => {
    const res = await api.get(`/journals/${id}`);
    return res.data;
  },
  deleteJournal: async (id) => {
    const res = await api.delete(`/journals/${id}`);
    return res.data;
  },
  getJournalEntries: async () => {
    const res = await api.get('/journal-entries');
    return res.data;
  },
  getJournalEntriesByJournalId: async (journalId) => {
    const res = await api.get(`/journal-entries/journal/${journalId}`);
    return res.data;
  },
  createJournalPosting: async (data) => {
    const res = await api.post('/journal-posting', data);
    return res.data;
  },

  // 13. Analytic Accounts & Budgets
  getAnalyticAccounts: async () => {
    const res = await api.get('/analytic-accounts');
    return res.data;
  },
  getAnalyticAccountById: async (id) => {
    const res = await api.get(`/analytic-accounts/${id}`);
    return res.data;
  },
  deleteAnalyticAccount: async (id) => {
    const res = await api.delete(`/analytic-accounts/${id}`);
    return res.data;
  },
  getBudgets: async () => {
    const res = await api.get('/budgets');
    return res.data;
  },
  getBudgetById: async (id) => {
    const res = await api.get(`/budgets/${id}`);
    return res.data;
  },
  deleteBudget: async (id) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },

  // 14. Financial Reports
  getProfitAndLoss: async () => {
    const res = await api.get('/reports/profit-loss');
    return res.data;
  },
  getBalanceSheet: async () => {
    const res = await api.get('/reports/balance-sheet');
    return res.data;
  },
  getBudgetReport: async () => {
    const res = await api.get('/reports/budget');
    return res.data;
  }
};

export default apiService;