import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, RefreshCw, FileText, ArrowRight, IndianRupee, Container, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const SalesOrdersPage = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [gateEntries, setGateEntries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    shippingLineId: '',
    gateEntryId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, entriesData, contactsData] = await Promise.all([
        apiService.getSalesOrders(),
        apiService.getGateEntries(),
        apiService.getContacts()
      ]);
      setSalesOrders(ordersData || []);
      setGateEntries(entriesData || []);
      setContacts((contactsData || []).filter((c) => c.contactType === 'SHIPPING_LINE' || c.contactId <= 3));
    } catch (err) {
      console.error('Failed to load sales orders', err);
      setAlert({ type: 'error', message: 'Failed to fetch sales orders.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    const id = deleteConfirmId;
    if (!id) return;
    try {
      await apiService.deleteSalesOrder(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleCreateSalesOrder = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await apiService.createSalesOrder({
        shippingLineId: Number(formData.shippingLineId),
        gateEntryId: Number(formData.gateEntryId)
      });
      setAlert({
        type: 'success',
        message: `Sales Order #${res.salesOrderId} created successfully for Total: ₹${res.totalAmount?.toLocaleString()}!`
      });
      setIsModalOpen(false);
      setFormData({ shippingLineId: '', gateEntryId: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create sales order', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to create sales order.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Sales Order ID',
      accessor: 'salesOrderId',
      render: (row) => (
        <span className="inline-block px-3 py-1 rounded-lg bg-[#28132e] text-white font-bold font-mono text-xs border border-pink-900/30 shadow-xs">
          SO #{row.salesOrderId}
        </span>
      )
    },
    {
      header: 'Shipping Line Carrier',
      accessor: 'shippingLineId',
      render: (row) => {
        const carrier = contacts.find((c) => c.contactId === row.shippingLineId);
        return <span className="font-semibold text-slate-800">{carrier ? carrier.contactName : `Carrier #${row.shippingLineId}`}</span>;
      }
    },
    {
      header: 'Linked Gate Entry',
      accessor: 'gateEntryId',
      render: (row) => {
        const entry = gateEntries.find((g) => g.gateEntryId === row.gateEntryId);
        return (
          <div className="text-xs">
            <span className="font-mono font-bold text-pink-700">Entry #{row.gateEntryId}</span>
            {entry && (
              <span className="text-slate-500 block font-mono text-[11px]">
                {entry.ocrContainerNumber} {entry.overweight ? '(Overweight)' : ''}
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Order Date',
      accessor: 'orderDate',
      render: (row) => <span className="font-mono text-xs text-slate-600">{row.orderDate || 'Today'}</span>
    },
    {
      header: 'Total Order Amount',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          ₹{Number(row.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'CONFIRMED'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.salesOrderId)}
          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Commercial &amp; Sales</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Sales Orders</span>
      </div>

      {alert && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold shadow-sm ${
            alert.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="underline cursor-pointer ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-[0_10px_30px_-8px_rgba(236,72,153,0.12)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Sales Orders &amp; Commercial Clearance
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Automatically applies standard Gate Clearance fee and Overweight Surcharges from Product Master.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Sales Order
        </button>
      </div>

      <DataTable
        columns={columns}
        data={salesOrders}
        searchPlaceholder="Search sales order ID, shipping line, gate entry..."
        emptyMessage="No sales orders recorded in database"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Sales Order for Gate Clearance"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSalesOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Select Shipping Line *
            </label>
            <select
              value={formData.shippingLineId}
              onChange={(e) => setFormData({ ...formData, shippingLineId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Shipping Line --</option>
              {contacts.map((c) => (
                <option key={c.contactId} value={c.contactId}>
                  {c.contactName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Select Gate Entry *
            </label>
            <select
              value={formData.gateEntryId}
              onChange={(e) => setFormData({ ...formData, gateEntryId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Gate Entry --</option>
              {gateEntries.map((ge) => (
                <option key={ge.gateEntryId} value={ge.gateEntryId}>
                  Entry #{ge.gateEntryId} - {ge.ocrContainerNumber} {ge.overweight ? `[OVERWEIGHT +₹${ge.overweightSurcharge}]` : '[COMPLIANT]'}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/70 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Automated Pricing Summary:</p>
            <p>• Base Gate Clearance: ₹2,000.00 (Product Master)</p>
            <p>• Overweight Surcharge: ₹5,000.00 (If weight exceeds gate threshold)</p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-pink-200 text-slate-600 hover:bg-pink-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="sp-sheen px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/30 hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Generating...' : 'Confirm Sales Order'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700 font-medium">
            Are you sure you want to delete this record?
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl border border-pink-200 text-slate-600 hover:bg-pink-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDelete}
              className="sp-sheen px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-bold shadow-md shadow-rose-500/30 hover:brightness-105 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default SalesOrdersPage;