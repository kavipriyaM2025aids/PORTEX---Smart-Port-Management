import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, RefreshCw, Wrench, IndianRupee, Package, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    vendorId: '',
    productId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [posData, contactsData, productsData] = await Promise.all([
        apiService.getPurchaseOrders(),
        apiService.getContacts(),
        apiService.getProducts()
      ]);
      setPurchaseOrders(posData || []);
      setVendors((contactsData || []).filter((c) => c.contactType === 'MAINTENANCE_VENDOR' || c.contactId >= 4));
      setProducts((productsData || []).filter((p) => p.productName?.toLowerCase().includes('calibration') || p.productId === 3));
    } catch (err) {
      console.error('Failed to load purchase orders', err);
      setAlert({ type: 'error', message: 'Failed to fetch purchase orders.' });
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
      await apiService.deletePurchaseOrder(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const po = await apiService.createPurchaseOrder({
        vendorId: Number(formData.vendorId),
        productId: Number(formData.productId)
      });
      setAlert({
        type: 'success',
        message: `Purchase Order #${po.poId} created for scale calibration maintenance (Total: ₹${po.totalAmount?.toLocaleString()})!`
      });
      setIsModalOpen(false);
      setFormData({ vendorId: '', productId: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create purchase order', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to create purchase order.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'PO ID',
      accessor: 'poId',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#24162F] text-white font-bold font-mono text-xs shadow-xs">
          PO #{row.poId}
        </span>
      )
    },
    {
      header: 'MAINTENANCE VENDOR',
      accessor: 'vendorId',
      render: (row) => {
        const v = vendors.find((vend) => vend.contactId === row.vendorId);
        return (
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-pink-600 shrink-0" />
            <span className="font-bold text-[#24162F] text-xs">
              {v ? v.contactName : `Vendor #${row.vendorId}`}
            </span>
          </div>
        );
      }
    },
    {
      header: 'SERVICE DESCRIPTION',
      accessor: 'serviceDescription',
      render: (row) => (
        <span className="text-xs text-[#34263F] font-semibold">
          {row.serviceDescription || 'Weighbridge Sensor Calibration Service'}
        </span>
      )
    },
    {
      header: 'PO DATE',
      accessor: 'poDate',
      render: (row) => (
        <span className="font-mono text-xs text-[#4A3454] font-bold">
          {row.poDate || '2026-09-20'}
        </span>
      )
    },
    {
      header: 'TOTAL PO AMOUNT',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-mono font-bold text-[#24162F] text-sm">
          ₹{Number(row.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'STATUS',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'APPROVED'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.poId)}
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
      <div className="flex items-center gap-2 text-xs font-semibold text-[#5a4563]">
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Purchase &amp; Vendor</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-[#24162F] font-bold">Purchase Orders</span>
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
          <button onClick={() => setAlert(null)} className="underline cursor-pointer ml-3 text-[#24162F] font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-[0_10px_30px_-8px_rgba(236,72,153,0.12)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#24162F] tracking-tight">
              Purchase Orders - Scale Calibration
            </h1>
            <p className="text-xs text-[#5a4563] font-semibold mt-1">
              Procure weighbridge calibration and port equipment maintenance from certified scale vendors.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </button>
      </div>

      <DataTable
        columns={columns}
        data={purchaseOrders}
        searchPlaceholder="Search PO ID, vendor, service..."
        emptyMessage="No purchase orders created"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Maintenance Purchase Order"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24162F] uppercase tracking-wider mb-1.5">
              1. Select Maintenance Vendor *
            </label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-[#30243D] font-medium focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Vendor --</option>
              {vendors.map((v) => (
                <option key={v.contactId} value={v.contactId} className="text-[#30243D] bg-white">
                  {v.contactName} ({v.address || 'Vendor'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24162F] uppercase tracking-wider mb-1.5">
              2. Select Service Product *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-[#30243D] font-medium focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Service --</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId} className="text-[#30243D] bg-white">
                  {p.productName} (₹{p.unitPrice?.toLocaleString()} - {p.description})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-pink-200 text-[#30243D] hover:bg-pink-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="sp-sheen px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/30 hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating...' : 'Create PO'}
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

export default PurchaseOrdersPage;