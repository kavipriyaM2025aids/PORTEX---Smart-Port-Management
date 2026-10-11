import React, { useState, useEffect } from 'react';
import {
  ScanLine,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Container,
  IndianRupee,
  ChevronRight,
  Trash2
} from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const GateEntryPage = () => {
  const [entries, setEntries] = useState([]);
  const [containers, setContainers] = useState([]);
  const [gates, setGates] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    containerId: '',
    gateId: '',
    ocrContainerNumber: '',
    actualWeight: '',
    simulateOcrError: false
  });

  // Selected container and gate details for real-time preview
  const selectedContainer = containers.find((c) => String(c.containerId) === String(formData.containerId));
  const selectedGate = gates.find((g) => String(g.gateId) === String(formData.gateId));
  const surchargeProduct = products.find((p) => p.productName?.toLowerCase().includes('overweight') || p.productId === 2);
  const clearanceProduct = products.find((p) => p.productName?.toLowerCase().includes('clearance') || p.productId === 1);

  const isOverweight =
    selectedGate && formData.actualWeight
      ? Number(formData.actualWeight) > Number(selectedGate.maxWeightLimit)
      : false;

  const calculatedSurcharge = isOverweight && surchargeProduct ? surchargeProduct.unitPrice : 0;

  const isOcrMatching =
    selectedContainer && formData.ocrContainerNumber
      ? selectedContainer.containerNumber.trim().toUpperCase() === formData.ocrContainerNumber.trim().toUpperCase()
      : false;

  const loadData = async () => {
    try {
      setLoading(true);
      const [entriesData, containersData, gatesData, productsData] = await Promise.all([
        apiService.getGateEntries(),
        apiService.getContainers(),
        apiService.getGates(),
        apiService.getProducts()
      ]);
      setEntries(entriesData || []);
      setContainers(containersData || []);
      setGates(gatesData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Failed to load gate entry data', err);
      setAlert({ type: 'error', message: 'Failed to fetch data from backend.' });
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
      await apiService.deleteGateEntry(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleContainerSelect = (id) => {
    const cont = containers.find((c) => String(c.containerId) === String(id));
    setFormData((prev) => ({
      ...prev,
      containerId: id,
      ocrContainerNumber: cont ? cont.containerNumber : ''
    }));
  };

  const handleProcessGateIn = async (e) => {
    e.preventDefault();
    if (!formData.containerId || !formData.gateId || !formData.actualWeight) {
      setAlert({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        containerId: Number(formData.containerId),
        gateId: Number(formData.gateId),
        ocrContainerNumber: formData.ocrContainerNumber.trim(),
        actualWeight: Number(formData.actualWeight)
      };

      const result = await apiService.processGateIn(payload);

      // Also create a linked weighbridge reading automatically
      try {
        await apiService.createWeighbridgeReading({
          gateEntryId: result.gateEntryId,
          deviceId: `WB-SENSOR-${formData.gateId}`,
          weight: Number(formData.actualWeight)
        });
      } catch (wbErr) {
        console.warn('Weighbridge reading linked creation notice:', wbErr);
      }

      setAlert({
        type: 'success',
        message: `Gate-In successfully processed! Clearance Status: ${result.clearanceStatus}, Overweight: ${
          result.overweight ? `YES (Surcharge: ₹${result.overweightSurcharge})` : 'NO'
        }`
      });
      setIsModalOpen(false);
      setFormData({
        containerId: '',
        gateId: '',
        ocrContainerNumber: '',
        actualWeight: '',
        simulateOcrError: false
      });
      loadData();
    } catch (err) {
      console.error('Gate-in error:', err);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to process Gate-In.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Entry ID',
      accessor: 'gateEntryId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.gateEntryId}</span>
    },
    {
      header: 'OCR Container Number',
      accessor: 'ocrContainerNumber',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ScanLine className="w-3.5 h-3.5 text-pink-600" />
          <span className="font-mono font-bold text-slate-900">{row.ocrContainerNumber || '—'}</span>
        </div>
      )
    },
    {
      header: 'OCR Status',
      accessor: 'ocrStatus',
      render: (row) => <Badge status={row.ocrStatus} />
    },
    {
      header: 'Gate ID / Limit',
      accessor: 'weightLimit',
      render: (row) => (
        <div className="text-xs">
          <span className="text-slate-800 font-semibold">Gate #{row.gateId}</span>
          <span className="text-slate-500 block font-mono text-[11px]">Limit: {row.weightLimit?.toLocaleString()} KG</span>
        </div>
      )
    },
    {
      header: 'Actual Weight',
      accessor: 'actualWeight',
      render: (row) => (
        <span className={`font-mono font-bold ${row.overweight ? 'text-rose-600' : 'text-emerald-700'}`}>
          {row.actualWeight?.toLocaleString()} KG
        </span>
      )
    },
    {
      header: 'Compliance & Surcharge',
      accessor: 'overweight',
      render: (row) => (
        <div>
          {row.overweight ? (
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-xs">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>Overweight (+₹{row.overweightSurcharge})</span>
            </div>
          ) : (
            <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Compliant (₹0)
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Clearance Status',
      accessor: 'clearanceStatus',
      render: (row) => <Badge status={row.clearanceStatus} />
    },
    {
      header: 'Timestamp',
      accessor: 'entryTime',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.entryTime ? String(row.entryTime).replace('T', ' ').slice(0, 19) : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.gateEntryId)}
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
        <span className="text-slate-800 font-bold">Gate Entry / OCR</span>
      </div>

      {/* Alert Banner */}
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
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Container Gate Entry &amp; OCR Scanner
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time optical character recognition (OCR), weighbridge compliance checks, and automated surcharge calculation.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Process New Gate-In Scan
        </button>
      </div>

      {/* Gate Entries Table */}
      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Search container number, gate, status..."
        emptyMessage="No gate entry records found"
      />

      {/* Gate In Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Process Container Gate Entry (POST /api/port/gate-in)"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleProcessGateIn} className="space-y-4">
          {/* Step 1: Select Registered Container */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Select Container Record *
            </label>
            <select
              value={formData.containerId}
              onChange={(e) => handleContainerSelect(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Container --</option>
              {containers.map((c) => (
                <option key={c.containerId} value={c.containerId}>
                  {c.containerNumber} (Type: {c.containerType || 'N/A'}, Line ID: {c.shippingLineId})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Gate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Select Gate &amp; Weight Limit *
            </label>
            <select
              value={formData.gateId}
              onChange={(e) => setFormData({ ...formData, gateId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Gate --</option>
              {gates.map((g) => (
                <option key={g.gateId} value={g.gateId}>
                  {g.gateCode} - {g.gateName} ({g.location}) [Max: {g.maxWeightLimit?.toLocaleString()} KG]
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: OCR Scanned Container Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. OCR Scanned Container Number (or Manual Entry) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.ocrContainerNumber}
                onChange={(e) => setFormData({ ...formData, ocrContainerNumber: e.target.value })}
                placeholder="e.g. MSKU1234567"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-900 font-bold uppercase focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
              />
              <ScanLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
            </div>
            {selectedContainer && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
                {isOcrMatching ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> OCR Match Confirmed (Will CLEAR)
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-500" /> OCR Mismatch Detected (Will REJECT)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Step 4: Weighbridge Actual Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. Actual Weight from Weighbridge (KG) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.actualWeight}
                onChange={(e) => setFormData({ ...formData, actualWeight: e.target.value })}
                placeholder="e.g. 34000"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-900 font-bold focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
              />
              <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
            </div>
          </div>

          {/* Live Weight Compliance & Surcharge Preview */}
          {selectedGate && formData.actualWeight && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                isOverweight
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>Weight Compliance Status:</span>
                <span>{isOverweight ? 'OVERWEIGHT DETECTED' : 'WITHIN LEGAL WEIGHT LIMIT'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-current/20">
                <div>Gate Limit: <span className="font-mono font-bold">{selectedGate.maxWeightLimit?.toLocaleString()} KG</span></div>
                <div>Actual Weight: <span className="font-mono font-bold">{Number(formData.actualWeight)?.toLocaleString()} KG</span></div>
              </div>
              {isOverweight && (
                <div className="pt-2 border-t border-rose-200 flex items-center justify-between font-bold text-rose-700">
                  <span>Product Master Overweight Surcharge:</span>
                  <span className="font-mono text-sm">₹{Number(calculatedSurcharge).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
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
              className="sp-sheen px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-500/30 hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
              Submit Gate-In Verification
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

export default GateEntryPage;