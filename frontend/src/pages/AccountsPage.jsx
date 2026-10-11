import React, { useState, useEffect } from 'react';
import { BookOpen, IndianRupee, Shield, TrendingUp, TrendingDown, Layers, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import apiService from '../api/apiService';

import Modal from '../components/Modal';
const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAccounts();
      setAccounts(data || []);
    } catch (err) {
      console.error('Failed to load accounts', err);
      setAlert({ type: 'error', message: 'Failed to fetch Chart of Accounts from backend.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);
  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    const id = deleteConfirmId;
    if (!id) return;
    try {
      await apiService.deleteAccount(id);
      loadAccounts();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const getTypeStyle = (type) => {
    switch (type) {
      case 'ASSET':
        return { icon: Shield, color: 'text-pink-600 bg-pink-50 border-pink-200' };
      case 'LIABILITY':
        return { icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'EQUITY':
        return { icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'INCOME':
        return { icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'EXPENSE':
        return { icon: TrendingDown, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      default:
        return { icon: BookOpen, color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  const columns = [
    {
      header: 'Account ID',
      accessor: 'accountId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.accountId}</span>
    },
    {
      header: 'Account Code',
      accessor: 'accountCode',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 bg-[#fff1f5] px-2.5 py-1 rounded-md border border-pink-200 text-xs">
          {row.accountCode}
        </span>
      )
    },
    {
      header: 'Account Title & Classification',
      accessor: 'accountName',
      render: (row) => {
        const { icon: Icon, color } = getTypeStyle(row.accountType);
        return (
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">{row.accountName}</span>
          </div>
        );
      }
    },
    {
      header: 'General Ledger Type',
      accessor: 'accountType',
      render: (row) => <Badge status={row.accountType} />
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
          onClick={() => handleDelete(row.accountId)}
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
        <span className="text-slate-800 font-bold">Chart of Accounts</span>
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
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Chart of Accounts
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Double-entry chart of accounts: Assets (Gate OCR, Weighbridge, Cash/Bank, Receivables), Liabilities (Payables, Security), Equity (Operating Capital), Income (Gate &amp; Surcharge Revenue), and Expenses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-700 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 shrink-0">
          Total Accounts: {accounts.length}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={accounts}
        searchPlaceholder="Search account code, name, type..."
        emptyMessage="No accounts found in database"
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

export default AccountsPage;