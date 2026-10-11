import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Calendar,
  ChevronDown,
  Copy,
  Check,
  MoreVertical,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Inbox,
  Trash2
} from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';
import portBanner from '../assets/port_banner.jpg';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const [formData, setFormData] = useState({
    salesOrderId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesData, ordersData] = await Promise.all([
        apiService.getInvoices(),
        apiService.getSalesOrders()
      ]);
      setInvoices(invoicesData || []);
      setSalesOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to load invoices', err);
      setAlert({ type: 'error', message: 'Failed to fetch invoices from MySQL.' });
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
      await apiService.deleteInvoice(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const invoice = await apiService.createInvoice(Number(formData.salesOrderId));
      setAlert({
        type: 'success',
        message: `Customer Invoice #${invoice.invoiceId} generated for ₹${Number(invoice.totalAmount || 0).toLocaleString()}! Double-entry ledger posted.`
      });
      setIsModalOpen(false);
      setFormData({ salesOrderId: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create invoice', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to generate invoice.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopySo = (soId) => {
    navigator.clipboard?.writeText(`SO #${soId}`);
    setCopiedId(soId);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      String(item.invoiceId).toLowerCase().includes(q) ||
      `inv #${item.invoiceId}`.toLowerCase().includes(q) ||
      String(item.salesOrderId).toLowerCase().includes(q) ||
      `so #${item.salesOrderId}`.toLowerCase().includes(q) ||
      String(item.status || '').toLowerCase().includes(q) ||
      String(item.invoiceDate || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-5">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Customer Invoices</span>
      </div>

      {/* Alert Notification */}
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

      {/* Hero Banner Card Matching Reference Image */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-[0_10px_30px_-8px_rgba(236,72,153,0.12)] p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 flex items-start gap-4 max-w-xl">
          {/* Glowing Pink Icon Badge */}
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/35 shrink-0">
            <Receipt className="w-6 h-6 drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl md:text-[26px] font-black tracking-tight text-slate-900 leading-tight">
              Customer Invoices &amp; Billing
            </h1>
            <p className="text-xs md:text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">
              Generate customer invoices with automated double-entry ledger integration to Customer Receivables.
            </p>
          </div>
        </div>

        {/* Port Banner Image on Right side */}
        <div className="relative w-full md:w-96 h-28 md:h-32 rounded-xl overflow-hidden border border-pink-300/40 shadow-inner shrink-0 group">
          <img
            src={portBanner}
            alt="Port Terminal at Sunset"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10" />
        </div>
      </div>

      {/* Control Bar: Search Input, Date Range, Generate Invoice Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Pill */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
          <input
            type="text"
            placeholder="Search invoice ID, sales order, status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-white/90 border border-pink-200/80 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400/20 shadow-xs transition-all"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Select Date Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="px-4 py-2.5 rounded-full bg-white/90 border border-pink-200/80 text-xs font-semibold text-slate-700 hover:bg-pink-50 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>Select Date Range</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          </div>

          {/* Primary Action Button: Pink/Magenta/Rose Gradient Pill */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/35 hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice Table Container Matching Reference Image */}
      <div className="rounded-2xl border border-pink-200/80 bg-white/90 backdrop-blur-md shadow-[0_10px_35px_-8px_rgba(236,72,153,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            {/* Soft pink/lavender table header */}
            <thead className="bg-[#faf1f5] text-[11px] uppercase text-slate-600 font-extrabold border-b border-pink-200/70 tracking-wider">
              <tr>
                <th className="px-5 py-4">INVOICE ID</th>
                <th className="px-5 py-4">SALES ORDER REF</th>
                <th className="px-5 py-4">INVOICE DATE</th>
                <th className="px-5 py-4">GATE CHARGE</th>
                <th className="px-5 py-4">OVERWEIGHT CHARGE</th>
                <th className="px-5 py-4">TOTAL AMOUNT</th>
                <th className="px-5 py-4">STATUS</th>
                <th className="px-5 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100/70 font-medium">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.invoiceId}
                    className="hover:bg-pink-50/50 transition-colors group"
                  >
                    {/* INVOICE ID: Soft Pink Pill Badge */}
                    <td className="px-5 py-4">
                      <span className="inline-block px-3 py-1 rounded-md bg-[#fff1f5] text-[#db2777] font-bold font-mono text-xs border border-pink-200/70 shadow-2xs">
                        INV #{inv.invoiceId}
                      </span>
                    </td>

                    {/* SALES ORDER REF: Deep Plum Pill with High Contrast Crisp WHITE Text */}
                    <td className="px-5 py-4">
                      <div
                        onClick={() => handleCopySo(inv.salesOrderId)}
                        className="inline-flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-lg bg-[#28132e] text-white font-semibold font-mono text-xs border border-pink-900/30 shadow-xs cursor-pointer hover:bg-[#381c40] transition-colors"
                        title="Click to copy Sales Order reference"
                      >
                        <span className="text-white font-bold">SO #{inv.salesOrderId}</span>
                        {copiedId === inv.salesOrderId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-pink-200/70 hover:text-white" />
                        )}
                      </div>
                    </td>

                    {/* INVOICE DATE */}
                    <td className="px-5 py-4 font-mono text-slate-600">
                      {inv.invoiceDate || '2026-09-20'}
                    </td>

                    {/* GATE CHARGE */}
                    <td className="px-5 py-4 font-mono text-slate-700">
                      ₹{Number(inv.gateCharge || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* OVERWEIGHT CHARGE */}
                    <td className="px-5 py-4 font-mono text-slate-700">
                      ₹{Number(inv.overweightSurcharge || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* TOTAL AMOUNT */}
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      ₹{Number(inv.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* STATUS PILL */}
                    <td className="px-5 py-4">
                      <Badge status={inv.status || 'ISSUED'} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4 text-center">
                      <button
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.invoiceId)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-pink-300 opacity-80" />
                    <p className="text-sm font-semibold text-slate-600">No customer invoices found</p>
                    <p className="text-xs text-slate-400 mt-1">Real-time data fetched from MySQL database</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-pink-100 bg-[#fdf8fa]/70 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredInvoices.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, filteredInvoices.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{filteredInvoices.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-pink-200/80 bg-white text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm shadow-pink-500/30'
                    : 'bg-white border border-pink-200/80 text-slate-600 hover:bg-pink-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filteredInvoices.length === 0}
              className="w-8 h-8 rounded-lg border border-pink-200/80 bg-white text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-50 hover:text-pink-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Customer Invoice (POST /api/port/invoices)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGenerateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Confirmed Sales Order *
            </label>
            <select
              value={formData.salesOrderId}
              onChange={(e) => setFormData({ ...formData, salesOrderId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Sales Order --</option>
              {salesOrders.map((so) => (
                <option key={so.salesOrderId} value={so.salesOrderId}>
                  SO #{so.salesOrderId} - Total: ₹{so.totalAmount?.toLocaleString()} (Gate Entry #{so.gateEntryId})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/70 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-pink-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated Double-Entry Posting
            </p>
            <p>• DR Customer Receivables (Account 1010)</p>
            <p>• CR Terminal Gate Revenue (Account 4001)</p>
            <p>• CR Overweight Surcharge Revenue (Account 4002 if applicable)</p>
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
              {submitting ? 'Generating...' : 'Generate Invoice'}
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

export default InvoicesPage;