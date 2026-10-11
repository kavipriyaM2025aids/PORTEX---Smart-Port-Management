import React, { useState, useEffect } from 'react';
import { PieChart, Tag, RefreshCw, MapPin, Layers, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import apiService from '../api/apiService';

import Modal from '../components/Modal';
const AnalyticAccountsPage = () => {
  const [analyticAccounts, setAnalyticAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalyticAccounts();
      setAnalyticAccounts(data || []);
    } catch (err) {
      console.error('Failed to load analytic accounts', err);
      setAlert({ type: 'error', message: 'Failed to fetch analytic accounts from backend.' });
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
      await apiService.deleteAnalyticAccount(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const columns = [
    {
      header: 'Analytic ID',
      accessor: 'analyticAccountId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.analyticAccountId}</span>
    },
    {
      header: 'Analytic Code',
      accessor: 'analyticCode',
      render: (row) => (
        <span className="font-mono font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-200 text-xs">
          {row.analyticCode}
        </span>
      )
    },
    {
      header: 'Analytic Cost Center & Terminal Zone',
      accessor: 'analyticName',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-50 border border-pink-200 text-pink-600">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-sm">{row.analyticName}</span>
            <span className="text-xs text-slate-500">{row.description}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'ACTIVE'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.analyticAccountId)}
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
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Master &amp; Accounting</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Analytic Accounts</span>
      </div>

      {alert && (
        <div className="p-4 rounded-2xl border bg-rose-50 border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between shadow-sm">
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="underline cursor-pointer ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-[0_10px_30px_-8px_rgba(236,72,153,0.12)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Analytic Accounts &amp; Cost Centers
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Cost and revenue analytics for port operational units (e.g. Port Terminal - Gate Terminal North Zone).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-700 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 shrink-0">
          Analytic Centers: {analyticAccounts.length}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={analyticAccounts}
        searchPlaceholder="Search analytic code, name, zone..."
        emptyMessage="No analytic accounts found"
      />

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

export default AnalyticAccountsPage;