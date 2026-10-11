import React, { useState, useEffect } from 'react';
import { Banknote, Plus, RefreshCw, IndianRupee, CheckCircle2, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const VendorPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    billId: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    referenceNumber: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, billsData] = await Promise.all([
        apiService.getPayments(),
        apiService.getVendorBills()
      ]);
      setPayments((paymentsData || []).filter((p) => p.paymentType === 'VENDOR_PAYMENT' || p.billId != null));
      setBills((billsData || []).filter((b) => b.status !== 'PAID'));
    } catch (err) {
      console.error('Failed to load vendor disbursements', err);
      setAlert({ type: 'error', message: 'Failed to fetch vendor disbursement records.' });
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
      await apiService.deleteVendorPayment(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleBillSelect = (billId) => {
    const bill = bills.find((b) => String(b.billId) === String(billId));
    setFormData((prev) => ({
      ...prev,
      billId: billId,
      amount: bill ? String(bill.amount) : '',
      referenceNumber: `BANK-VENDOR-${Math.floor(10000 + Math.random() * 90000)}`
    }));
  };

  const handleRecordVendorPayment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.createVendorPayment({
        billId: Number(formData.billId),
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber.trim()
      });
      setAlert({
        type: 'success',
        message: 'Vendor payment recorded! Vendor bill updated to PAID and balanced journal posted (DR Maintenance Payables / CR Cash/Bank).'
      });
      setIsModalOpen(false);
      setFormData({ billId: '', amount: '', paymentMethod: 'BANK_TRANSFER', referenceNumber: '' });
      loadData();
    } catch (err) {
      console.error('Failed to record vendor payment', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to record vendor payment.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Payment ID',
      accessor: 'paymentId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.paymentId}</span>
    },
    {
      header: 'Vendor Bill ID',
      accessor: 'billId',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#fff1f5] text-[#db2777] font-bold font-mono text-xs border border-pink-200 shadow-2xs">
          BILL #{row.billId}
        </span>
      )
    },
    {
      header: 'Payment Date',
      accessor: 'paymentDate',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.paymentDate || 'Today'}</span>
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (row) => <Badge status={row.paymentMethod} />
    },
    {
      header: 'Reference Number',
      accessor: 'referenceNumber',
      render: (row) => <span className="font-mono text-xs text-slate-700 font-semibold">{row.referenceNumber || '—'}</span>
    },
    {
      header: 'Amount Paid (₹)',
      accessor: 'amount',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          ₹{Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Type',
      accessor: 'paymentType',
      render: (row) => <Badge status={row.paymentType || 'VENDOR_PAYMENT'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.paymentId)}
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
        <span className="text-slate-800 font-bold">Vendor Payments</span>
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
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Vendor Payments &amp; Disbursements
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Disburse maintenance vendor payments with automatic double-entry liability settlement against Cash/Bank.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Disburse Vendor Payment
        </button>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        searchPlaceholder="Search payment ID, reference, bill..."
        emptyMessage="No vendor payments recorded"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Disburse Vendor Payment"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRecordVendorPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Select Pending Vendor Bill *
            </label>
            <select
              value={formData.billId}
              onChange={(e) => handleBillSelect(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Bill to Settle --</option>
              {bills.map((b) => (
                <option key={b.billId} value={b.billId}>
                  BILL #{b.billId} - Amount: ₹{b.amount?.toLocaleString()} (PO #{b.poId}) [{b.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Payment Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-900 font-bold focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Payment Method *
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. Reference / Transaction Number *
            </label>
            <input
              type="text"
              placeholder="e.g. BANK-VENDOR-20001"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/70 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automatic Double-Entry Journal:
            </p>
            <p>• DR Maintenance Payables (Account 2001)</p>
            <p>• CR Cash/Bank (Account 1003)</p>
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
              {submitting ? 'Disbursing...' : 'Confirm Disbursement'}
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

export default VendorPaymentsPage;