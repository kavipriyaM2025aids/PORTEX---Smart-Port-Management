import React, { useState, useEffect } from 'react';
import { FileText, Plus, RefreshCw, CheckCircle2, AlertCircle, Scale, IndianRupee, ArrowRight, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('journals'); // 'journals' | 'entries'
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Manual Journal Form State
  const [formData, setFormData] = useState({
    journalType: 'SALES',
    referenceType: 'MANUAL',
    referenceId: '100',
    description: '',
    entries: [
      { accountId: '', debit: '', credit: '', description: '' },
      { accountId: '', debit: '', credit: '', description: '' }
    ]
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [journalsData, entriesData, accountsData] = await Promise.all([
        apiService.getJournals(),
        apiService.getJournalEntries(),
        apiService.getAccounts()
      ]);
      setJournals(journalsData || []);
      setJournalEntries(entriesData || []);
      setAccounts(accountsData || []);
    } catch (err) {
      console.error('Failed to load journals', err);
      setAlert({ type: 'error', message: 'Failed to fetch journal data.' });
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
      await apiService.deleteJournal(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  // Compute Total Debits & Credits for validation
  const totalDebit = formData.entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
  const totalCredit = formData.entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleEntryChange = (index, field, value) => {
    const updated = [...formData.entries];
    updated[index][field] = value;
    setFormData({ ...formData, entries: updated });
  };

  const addEntryRow = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { accountId: '', debit: '', credit: '', description: '' }]
    });
  };

  const removeEntryRow = (idx) => {
    if (formData.entries.length <= 2) return;
    const updated = formData.entries.filter((_, i) => i !== idx);
    setFormData({ ...formData, entries: updated });
  };

  const handleCreateJournal = async (e) => {
    e.preventDefault();
    if (!isBalanced) {
      setAlert({
        type: 'error',
        message: `Journal is not balanced! Total Debit: ₹${totalDebit} vs Total Credit: ₹${totalCredit}`
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        journalType: formData.journalType,
        referenceType: formData.referenceType,
        referenceId: Number(formData.referenceId) || 1,
        description: formData.description.trim(),
        entries: formData.entries.map((e) => ({
          accountId: Number(e.accountId),
          debit: Number(e.debit) || 0,
          credit: Number(e.credit) || 0,
          description: e.description.trim() || formData.description.trim()
        }))
      };

      const res = await apiService.createJournalPosting(payload);
      setAlert({
        type: 'success',
        message: `Balanced double-entry journal #${res.journalId} posted successfully to general ledger!`
      });
      setIsModalOpen(false);
      setFormData({
        journalType: 'SALES',
        referenceType: 'MANUAL',
        referenceId: '100',
        description: '',
        entries: [
          { accountId: '', debit: '', credit: '', description: '' },
          { accountId: '', debit: '', credit: '', description: '' }
        ]
      });
      loadData();
    } catch (err) {
      console.error('Failed to post journal', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to post balanced journal.' });
    } finally {
      setSubmitting(false);
    }
  };

  const journalColumns = [
    {
      header: 'Journal ID',
      accessor: 'journalId',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#fff1f5] text-[#db2777] font-bold font-mono text-xs border border-pink-200 shadow-2xs">
          JNL #{row.journalId}
        </span>
      )
    },
    {
      header: 'Journal Date',
      accessor: 'journalDate',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.journalDate}</span>
    },
    {
      header: 'Journal Type',
      accessor: 'journalType',
      render: (row) => <Badge status={row.journalType} />
    },
    {
      header: 'Reference Type / ID',
      accessor: 'referenceType',
      render: (row) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#28132e] text-white font-bold border border-pink-900/30 shadow-xs">
          {row.referenceType || 'TX'} #{row.referenceId ?? '—'}
        </span>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span className="text-xs text-slate-700 font-medium line-clamp-1">{row.description}</span>
    },
    {
      header: 'Validation',
      accessor: 'journalId',
      render: () => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Balanced
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.journalId)}
          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  const entryColumns = [
    {
      header: 'Entry ID',
      accessor: 'journalEntryId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.journalEntryId}</span>
    },
    {
      header: 'Journal Ref',
      accessor: 'journalId',
      render: (row) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#fff1f5] text-pink-700 border border-pink-200 font-bold">
          JNL #{row.journalId}
        </span>
      )
    },
    {
      header: 'Account Name & Code',
      accessor: 'accountId',
      render: (row) => {
        const acc = accounts.find((a) => a.accountId === row.accountId);
        return (
          <div>
            <span className="font-bold text-slate-900 block text-xs">{acc ? acc.accountName : `Account #${row.accountId}`}</span>
            <span className="font-mono text-[11px] text-slate-500">Code: {acc ? acc.accountCode : '—'}</span>
          </div>
        );
      }
    },
    {
      header: 'Debit Amount (DR)',
      accessor: 'debit',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-sm">
          {Number(row.debit || 0) > 0 ? `₹${Number(row.debit).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
        </span>
      )
    },
    {
      header: 'Credit Amount (CR)',
      accessor: 'credit',
      render: (row) => (
        <span className="font-mono font-bold text-pink-700 text-sm">
          {Number(row.credit || 0) > 0 ? `₹${Number(row.credit).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
        </span>
      )
    },
    {
      header: 'Memo / Description',
      accessor: 'description',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{row.description || '—'}</span>
    }
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Master &amp; Accounting</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Journals</span>
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
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Double-Entry Journals &amp; General Ledger
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Enforces strict balanced journal rules (Debit = Credit) across SALES, PURCHASE, CASH, and BANK journals.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Balanced Journal
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-pink-200/70 gap-6">
        <button
          onClick={() => setActiveTab('journals')}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'journals' ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Journals Directory ({journals.length})
          {activeTab === 'journals' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('entries')}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'entries' ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Journal Entry Lines ({journalEntries.length})
          {activeTab === 'entries' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full" />}
        </button>
      </div>

      {activeTab === 'journals' ? (
        <DataTable
          columns={journalColumns}
          data={journals}
          searchPlaceholder="Search journal ID, type, reference..."
          emptyMessage="No journals recorded in general ledger"
        />
      ) : (
        <DataTable
          columns={entryColumns}
          data={journalEntries}
          searchPlaceholder="Search entry ID, account, memo..."
          emptyMessage="No journal entries found"
        />
      )}

      {/* Balanced Journal Creator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Balanced Double-Entry Journal (POST /api/port/journal-posting)"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateJournal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Journal Type *
              </label>
              <select
                value={formData.journalType}
                onChange={(e) => setFormData({ ...formData, journalType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
              >
                <option value="SALES">SALES</option>
                <option value="PURCHASE">PURCHASE</option>
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reference Type
              </label>
              <input
                type="text"
                value={formData.referenceType}
                onChange={(e) => setFormData({ ...formData, referenceType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reference ID
              </label>
              <input
                type="number"
                value={formData.referenceId}
                onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Journal Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Manual adjustment for port terminal maintenance"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          {/* Journal Entry Lines */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Debit &amp; Credit Lines</span>
              <button
                type="button"
                onClick={addEntryRow}
                className="text-xs text-pink-600 hover:text-pink-700 font-bold cursor-pointer"
              >
                + Add Line
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {formData.entries.map((entry, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-pink-50/50 border border-pink-100 items-center text-xs">
                  <div className="col-span-5">
                    <select
                      value={entry.accountId}
                      onChange={(e) => handleEntryChange(idx, 'accountId', e.target.value)}
                      required
                      className="w-full px-2.5 py-2 bg-white border border-pink-200 rounded-lg text-slate-800 focus:outline-none"
                    >
                      <option value="">-- Choose Account --</option>
                      {accounts.map((a) => (
                        <option key={a.accountId} value={a.accountId}>
                          {a.accountCode} - {a.accountName} ({a.accountType})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Debit (₹)"
                      value={entry.debit}
                      onChange={(e) => handleEntryChange(idx, 'debit', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-pink-200 rounded-lg text-slate-900 font-bold font-mono focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Credit (₹)"
                      value={entry.credit}
                      onChange={(e) => handleEntryChange(idx, 'credit', e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-pink-200 rounded-lg text-pink-700 font-bold font-mono focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    {formData.entries.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeEntryRow(idx)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-base cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Validation Balance Bar */}
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {isBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                <span>{isBalanced ? 'BALANCED JOURNAL VALIDATED' : 'UNBALANCED: DEBITS MUST EQUAL CREDITS'}</span>
              </div>
              <div className="font-mono space-x-3 text-xs">
                <span>Total Debit: <strong>₹{totalDebit.toFixed(2)}</strong></span>
                <span>Total Credit: <strong>₹{totalCredit.toFixed(2)}</strong></span>
              </div>
            </div>
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
              disabled={submitting || !isBalanced}
              className="sp-sheen px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/30 hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Posting...' : 'Post Journal to Ledger'}
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

export default JournalsPage;