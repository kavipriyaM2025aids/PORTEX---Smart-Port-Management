import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, IndianRupee, Calendar, BarChart2, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import apiService from '../api/apiService';

import Modal from '../components/Modal';
const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [analyticAccounts, setAnalyticAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, analyticData] = await Promise.all([
        apiService.getBudgets(),
        apiService.getAnalyticAccounts()
      ]);
      setBudgets(budgetsData || []);
      setAnalyticAccounts(analyticData || []);
    } catch (err) {
      console.error('Failed to load budgets', err);
      setAlert({ type: 'error', message: 'Failed to fetch budgets from backend.' });
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
      await apiService.deleteBudget(id);
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
      header: 'Budget ID',
      accessor: 'budgetId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.budgetId}</span>
    },
    {
      header: 'Budget Title & Analytic Zone',
      accessor: 'budgetName',
      render: (row) => {
        const analytic = analyticAccounts.find((a) => a.analyticAccountId === row.analyticAccountId);
        return (
          <div>
            <span className="font-bold text-slate-900 block text-sm">{row.budgetName}</span>
            <span className="text-xs text-pink-700 font-mono">
              Zone: {analytic ? analytic.analyticName : `Analytic #${row.analyticAccountId}`}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Financial Year',
      accessor: 'financialYear',
      render: (row) => (
        <span className="font-mono font-bold px-2.5 py-1 rounded-md bg-[#fff1f5] border border-pink-200 text-xs text-slate-800">
          {row.financialYear}
        </span>
      )
    },
    {
      header: 'Planned Revenue',
      accessor: 'plannedRevenue',
      render: (row) => (
        <span className="font-mono font-medium text-slate-600">
          ₹{Number(row.plannedRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Actual Revenue',
      accessor: 'actualRevenue',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-700">
          ₹{Number(row.actualRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Planned Expense',
      accessor: 'plannedExpense',
      render: (row) => (
        <span className="font-mono font-medium text-slate-600">
          ₹{Number(row.plannedExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Actual Expense',
      accessor: 'actualExpense',
      render: (row) => (
        <span className="font-mono font-bold text-rose-600">
          ₹{Number(row.actualExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'APPROVED'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.budgetId)}
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
        <span className="text-slate-800 font-bold">Budgets</span>
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
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Budget Management &amp; Target Control
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Compare planned vs actual revenue and operational expenses per terminal zone and financial year.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-700 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 shrink-0">
          Active Budget Cycles: {budgets.length}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={budgets}
        searchPlaceholder="Search budget name, financial year, zone..."
        emptyMessage="No budget records found"
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

export default BudgetsPage;