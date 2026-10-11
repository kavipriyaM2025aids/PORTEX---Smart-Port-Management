import React, { useState, useEffect } from 'react';
import { Container as ContainerIcon, Plus, RefreshCw, Ship, ChevronRight , Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import apiService from '../api/apiService';

const ContainersPage = () => {
  const [containers, setContainers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    containerNumber: '',
    shippingLineId: '',
    containerType: '40FT'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [containersData, contactsData] = await Promise.all([
        apiService.getContainers(),
        apiService.getContacts()
      ]);
      setContainers(containersData || []);
      setContacts((contactsData || []).filter((c) => c.contactType === 'SHIPPING_LINE' || c.contactId <= 3));
    } catch (err) {
      console.error('Failed to load containers', err);
      setAlert({ type: 'error', message: 'Failed to fetch containers.' });
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
      await apiService.deleteContainer(id);
      loadData();
      setAlert({ type: 'success', message: 'Record deleted successfully.' });
    } catch (err) {
      console.error('Delete failed', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete record.' });
    } finally {
      setDeleteConfirmId(null);
    }
  };



  const handleCreateContainer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.createContainer({
        containerNumber: formData.containerNumber.trim().toUpperCase(),
        shippingLineId: Number(formData.shippingLineId),
        containerType: formData.containerType
      });
      setAlert({ type: 'success', message: 'Container registered successfully in MySQL database!' });
      setIsModalOpen(false);
      setFormData({ containerNumber: '', shippingLineId: '', containerType: '40FT' });
      loadData();
    } catch (err) {
      console.error('Failed to create container', err);
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to create container.' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Container ID',
      accessor: 'containerId',
      render: (row) => <span className="font-mono font-bold text-slate-800">#{row.containerId}</span>
    },
    {
      header: 'Container Number',
      accessor: 'containerNumber',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ContainerIcon className="w-4 h-4 text-pink-600" />
          <span className="font-mono font-bold text-slate-900 text-sm">{row.containerNumber}</span>
        </div>
      )
    },
    {
      header: 'Shipping Line Carrier',
      accessor: 'shippingLineId',
      render: (row) => {
        const line = contacts.find((c) => c.contactId === row.shippingLineId);
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
            <Ship className="w-3.5 h-3.5 text-pink-400" />
            <span>{line ? line.contactName : `Shipping Line #${row.shippingLineId}`}</span>
          </div>
        );
      }
    },
    {
      header: 'Container Type',
      accessor: 'containerType',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
          {row.containerType || 'STANDARD'}
        </span>
      )
    },
    {
      header: 'Registration Date',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-500 font-mono">
          {row.createdAt ? String(row.createdAt).replace('T', ' ').slice(0, 19) : 'Registered'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.containerId)}
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
        <span className="text-slate-800 font-bold">Containers</span>
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
            <ContainerIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Cargo Container Management
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Global standard ISO container directory linked with shipping line carriers.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="sp-sheen px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/30 hover:brightness-105 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register New Container
        </button>
      </div>

      <DataTable
        columns={columns}
        data={containers}
        searchPlaceholder="Search container number, type, carrier..."
        emptyMessage="No containers registered in database"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Cargo Container"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateContainer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Container Number (ISO 6346) *
            </label>
            <input
              type="text"
              placeholder="e.g. MSCU1234567"
              value={formData.containerNumber}
              onChange={(e) => setFormData({ ...formData, containerNumber: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs font-mono text-slate-900 font-bold uppercase focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shipping Line Carrier *
            </label>
            <select
              value={formData.shippingLineId}
              onChange={(e) => setFormData({ ...formData, shippingLineId: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="">-- Choose Shipping Line --</option>
              {contacts.map((c) => (
                <option key={c.contactId} value={c.contactId}>
                  {c.contactName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Container Type *
            </label>
            <select
              value={formData.containerType}
              onChange={(e) => setFormData({ ...formData, containerType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl text-xs text-slate-800 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <option value="20FT">20 FT Standard Dry Container</option>
              <option value="40FT">40 FT Standard Dry Container</option>
              <option value="40HC">40 FT High Cube Container</option>
              <option value="REEFER">Reefer (Refrigerated) Container</option>
              <option value="FLAT_RACK">Flat Rack / Out of Gauge</option>
            </select>
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
              {submitting ? 'Registering...' : 'Register Container'}
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

export default ContainersPage;