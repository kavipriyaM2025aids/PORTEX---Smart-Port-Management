import React, { useState, useEffect } from 'react';
import { Scale, Plus, RefreshCw, Link as LinkIcon, Radio, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const WeighbridgePage = () => {
  const [readings, setReadings] = useState([]);
  const [gateEntries, setGateEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    gateEntryId: '',
    deviceId: 'WB-STATION-01',
    weight: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [readingsData, entriesData] = await Promise.all([
        apiService.getWeighbridgeReadings(),
        apiService.getGateEntries()
      ]);
      setReadings(readingsData || []);
      setGateEntries(entriesData || []);
    } catch (err) {
      console.error('Failed to load weighbridge readings', err);
      setAlert({ type: 'error', message: 'Failed to fetch weighbridge data.' });
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
      await apiService.deleteWeighbridgeReading(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleCreateReading = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.createWeighbridgeReading({
        gateEntryId: Number(formData.gateEntryId),
        deviceId: formData.deviceId.trim(),
        weight: Number(formData.weight)
      });
      setAlert({ type: 'success', message: 'Weighbridge reading recorded successfully!' });
      setIsModalOpen(false);
      setFormData({ gateEntryId: '', deviceId: 'WB-STATION-01', weight: '' });
      loadData();
    } catch (err) {
      console.error('Failed to record weighbridge reading', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to record reading.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'READING ID',
      accessor: 'readingId',
      render: (row) => <span className="font-mono font-bold text-[#24162F]">#{row.readingId}</span>
    },
    {
      header: 'DEVICE ID',
      accessor: 'deviceId',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-pink-600 shrink-0" />
          <span className="font-mono font-bold text-[#24162F]">{row.deviceId || 'WB-DEVICE'}</span>
        </div>
      )
    },
    {
      header: 'LINKED GATE ENTRY',
      accessor: 'gateEntryId',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-pink-100/70 border border-pink-300 text-[#24162F] font-mono text-xs font-bold">
          Entry #{row.gateEntryId}
        </span>
      )
    },
    {
      header: 'WEIGHT READING',
      accessor: 'weight',
      render: (row) => (
        <span className="font-mono font-black text-[#24162F] text-sm">
          {row.weight?.toLocaleString()} {row.unit || 'KG'}
        </span>
      )
    },
    {
      header: 'READING STATUS',
      accessor: 'readingStatus',
      render: (row) => <Badge status={row.readingStatus || 'VALID'} />
    },
    {
      header: 'READING TIMESTAMP',
      accessor: 'readingTime',
      render: (row) => (
        <span className="text-xs text-[#4A3454] font-mono font-bold">
          {row.readingTime ? String(row.readingTime).replace('T', ' ').slice(0, 19) : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.readingId)}
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
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Operations</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-[#24162F] font-bold">Weighbridge</span>
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
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#24162F] tracking-tight">
              Weighbridge Sensor Readings
            </h1>
            <p className="text-xs text-[#5a4563] font-semibold mt-1">
              Real-time weight logs captured from port terminal load cell weighbridge devices.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Record Weighbridge Reading
        </button>
      </div>

      <DataTable
        columns={columns}
        data={readings}
        searchPlaceholder="Search reading ID, device, gate entry..."
        emptyMessage="No weighbridge sensor readings found"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Weighbridge Reading"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateReading} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24162F] uppercase tracking-wider mb-1.5">
              Select Gate Entry *
            </label>
            <select
              value={formData.gateEntryId}
              onChange={(e) => setFormData({ ...formData, gateEntryId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-[#30243D] font-medium focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Gate Entry --</option>
              {gateEntries.map((ge) => (
                <option key={ge.gateEntryId} value={ge.gateEntryId} className="text-[#30243D] bg-white">
                  Entry #{ge.gateEntryId} - {ge.ocrContainerNumber || 'No OCR'} (Gate #{ge.gateId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24162F] uppercase tracking-wider mb-1.5">
              Device Sensor ID *
            </label>
            <input
              type="text"
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-[#24162F] font-bold focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24162F] uppercase tracking-wider mb-1.5">
              Weight (KG) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="e.g. 34000"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-[#24162F] font-bold focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
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
              {submitting ? 'Recording...' : 'Save Reading'}
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

export default WeighbridgePage;