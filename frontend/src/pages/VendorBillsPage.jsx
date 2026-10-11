import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, RefreshCw, IndianRupee, CheckCircle2, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const VendorBillsPage = () => {
  const [vendorBills, setVendorBills] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    poId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [billsData, posData] = await Promise.all([
        apiService.getVendorBills(),
        apiService.getPurchaseOrders()
      ]);
      setVendorBills(billsData || []);
      setPurchaseOrders(posData || []);
    } catch (err) {
      console.error('Failed to load vendor bills', err);
      setAlert({ type: 'error', message: 'Failed to fetch vendor bills.' });
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
      await apiService.deleteVendorBill(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleCreateVendorBill = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const bill = await apiService.createVendorBill(Number(formData.poId));
      setAlert({
        type: 'success',
        message: `Vendor Bill #${bill.billId} generated for ₹${bill.amount?.toLocaleString()}! Double-entry journal automatically posted (DR Weighbridge Expenses / CR Maintenance Payables).`
      });
      setIsModalOpen(false);
      setFormData({ poId: '' });
      loadData();
    } catch (err) {
      console.error('Failed to generate vendor bill', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to generate vendor bill.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Bill ID',
      accessor: 'billId',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#fff1f5] text-[#db2777] font-bold font-mono text-xs border border-pink-200 shadow-2xs">
          BILL #{row.billId}
        </span>
      )
    },
    {
      header: 'Purchase Order Ref',
      accessor: 'poId',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#28132e] text-white font-bold font-mono text-xs border border-pink-900/30 shadow-xs">
          PO #{row.poId}
        </span>
      )
    },
    {
      header: 'Bill Date',
      accessor: 'billDate',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.billDate || 'Today'}</span>
    },
    {
      header: 'Bill Amount (₹)',
      accessor: 'amount',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          ₹{Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'POSTED'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.billId)}
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
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Purchase &amp; Vendor</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Vendor Bills</span>
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
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Vendor Bills
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Generate vendor bills from approved purchase orders with automated expense &amp; liability double-entry ledger postings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Generate Vendor Bill from PO
        </button>
      </div>

      <DataTable
        columns={columns}
        data={vendorBills}
        searchPlaceholder="Search bill ID, PO, amount, status..."
        emptyMessage="No vendor bills found"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Vendor Bill (POST /api/port/vendor-bills)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateVendorBill} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Approved Purchase Order *
            </label>
            <select
              value={formData.poId}
              onChange={(e) => setFormData({ ...formData, poId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Purchase Order --</option>
              {purchaseOrders.map((po) => (
                <option key={po.poId} value={po.poId}>
                  PO #{po.poId} - {po.serviceDescription} (Amount: ₹{po.totalAmount?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/70 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated Double-Entry Journal:
            </p>
            <p>• DR Weighbridge Maintenance Expenses (Account 5001)</p>
            <p>• CR Maintenance Payables (Account 2001)</p>
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
              {submitting ? 'Generating...' : 'Generate Bill'}
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

export default VendorBillsPage;