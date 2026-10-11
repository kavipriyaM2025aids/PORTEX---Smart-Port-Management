import React, { useState, useEffect } from 'react';
import { DoorClosed, Plus, RefreshCw, MapPin, Scale, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const GatesPage = () => {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    gateCode: '',
    gateName: '',
    location: '',
    maxWeightLimit: '',
    status: 'ACTIVE'
  });

  const loadGates = async () => {
    try {
      setLoading(true);
      const data = await apiService.getGates();
      setGates(data || []);
    } catch (err) {
      console.error('Failed to load gates', err);
      setAlert({ type: 'error', message: 'Failed to fetch gates.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGates();
  }, []);
  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    const id = deleteConfirmId;
    if (!id) return;
    try {
      await apiService.deleteGate(id);
      loadGates();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleCreateGate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.createGate({
        gateCode: formData.gateCode.trim().toUpperCase(),
        gateName: formData.gateName.trim(),
        location: formData.location.trim(),
        maxWeightLimit: Number(formData.maxWeightLimit),
        status: formData.status
      });
      setAlert({ type: 'success', message: 'New port gate created successfully via POST /api/port/gates!' });
      setIsModalOpen(false);
      setFormData({
        gateCode: '',
        gateName: '',
        location: '',
        maxWeightLimit: '',
        status: 'ACTIVE'
      });
      loadGates();
    } catch (err) {
      console.error('Failed to create gate', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to create gate.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Gate ID',
      accessor: 'gateId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.gateId}</span>
    },
    {
      header: 'Gate Code',
      accessor: 'gateCode',
      render: (row) => (
        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#fff1f5] text-[#db2777] font-mono font-bold text-xs border border-pink-200">
          {row.gateCode}
        </span>
      )
    },
    {
      header: 'Gate Name',
      accessor: 'gateName',
      render: (row) => (
        <div className="flex items-center gap-2">
          <DoorClosed className="w-4 h-4 text-pink-500" />
          <span className="font-bold text-slate-900">{row.gateName}</span>
        </div>
      )
    },
    {
      header: 'Location / Zone',
      accessor: 'location',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-pink-400" />
          <span>{row.location || 'Port Zone'}</span>
        </div>
      )
    },
    {
      header: 'Max Weight Limit',
      accessor: 'maxWeightLimit',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
          <Scale className="w-3.5 h-3.5 text-amber-500" />
          <span>{row.maxWeightLimit?.toLocaleString()} KG</span>
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
          onClick={() => handleDelete(row.gateId)}
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
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Operations</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Gate Master</span>
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
            <DoorClosed className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Port Gate Management
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Configure physical entry/exit gates and enforceable legal gross vehicle weight limits.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Port Gate
        </button>
      </div>

      <DataTable
        columns={columns}
        data={gates}
        searchPlaceholder="Search gate code, name, location..."
        emptyMessage="No port gates configured yet"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Port Gate Terminal"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateGate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gate Code *
            </label>
            <input
              type="text"
              placeholder="e.g. GATE-04"
              value={formData.gateCode}
              onChange={(e) => setFormData({ ...formData, gateCode: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-900 font-bold uppercase focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gate Name *
            </label>
            <input
              type="text"
              placeholder="e.g. East Express OCR Terminal"
              value={formData.gateName}
              onChange={(e) => setFormData({ ...formData, gateName: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location / Terminal Zone *
            </label>
            <input
              type="text"
              placeholder="e.g. Zone A - Berth 4"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Max Legal Weight Limit (KG) *
            </label>
            <input
              type="number"
              placeholder="e.g. 35000"
              value={formData.maxWeightLimit}
              onChange={(e) => setFormData({ ...formData, maxWeightLimit: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-900 font-bold focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
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
              {submitting ? 'Creating...' : 'Create Gate'}
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

export default GatesPage;