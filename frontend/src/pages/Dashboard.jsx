import React, { useEffect, useState } from 'react';
import {
  Container,
  ScanLine,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  Receipt,
  DoorClosed,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  Zap,
  CheckCircle2,
  Clock,
  Radio,
  Plus,
  FileText,
  Activity,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import apiService from '../api/apiService';
import portBanner from '../assets/port_banner.jpg';

const Dashboard = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    containersCount: 0,
    gateEntriesCount: 0,
    overweightCount: 0,
    revenue: 0,
    expense: 0,
    netProfit: 0,
    pendingInvoicesCount: 0,
    activeGatesCount: 0,
    weighbridgesCount: 0
  });
  const [recentGateEntries, setRecentGateEntries] = useState([]);
  const [recentJournals, setRecentJournals] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        containers,
        gateEntries,
        gates,
        invoices,
        pnl,
        journals,
        weighbridges
      ] = await Promise.all([
        apiService.getContainers().catch(() => []),
        apiService.getGateEntries().catch(() => []),
        apiService.getGates().catch(() => []),
        apiService.getInvoices().catch(() => []),
        apiService.getProfitAndLoss().catch(() => ({ totalRevenue: 0, totalExpense: 0, netProfitOrLoss: 0 })),
        apiService.getJournals().catch(() => []),
        apiService.getWeighbridgeReadings().catch(() => [])
      ]);

      const overweight = (gateEntries || []).filter((g) => g.overweight).length;
      const pendingInvoices = (invoices || []).filter((i) => i.status !== 'PAID').length;
      const activeGates = (gates || []).filter((g) => g.status === 'ACTIVE').length;

      setStats({
        containersCount: (containers || []).length,
        gateEntriesCount: (gateEntries || []).length,
        overweightCount: overweight,
        revenue: pnl.totalRevenue || 0,
        expense: pnl.totalExpense || 0,
        netProfit: pnl.netProfitOrLoss || 0,
        pendingInvoicesCount: pendingInvoices,
        activeGatesCount: activeGates,
        weighbridgesCount: (weighbridges || []).length || (gates || []).length
      });

      setRecentGateEntries((gateEntries || []).slice(-6).reverse());
      setRecentJournals((journals || []).slice(-5).reverse());
      setRecentInvoices((invoices || []).slice(-5).reverse());
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero / Banner Section Matching Reference Image */}
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-[0_12px_35px_-8px_rgba(236,72,153,0.12)] p-6 md:p-8">
        {/* Soft Decorative Ambient Background */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-pink-400/20 via-purple-400/15 to-transparent blur-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-pink-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
              MUNICIPAL PORT AUTHORITY
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Welcome to <span className="sp-gradient-text">PORTEX</span>
              </h1>
              <p className="text-sm font-semibold text-pink-700/80 mt-0.5">
                Smart Port Cargo &amp; Gate Management System
              </p>
            </div>
            <p className="text-xs md:text-[13px] text-slate-500 font-medium leading-relaxed">
              Streamline operations, ensure compliance, and drive efficiency with real-time port management.
            </p>

            {/* Visual Feature Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50/70 border border-pink-200/60 text-xs font-semibold text-slate-700">
                <Zap className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Faster Operations</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Better Compliance</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs font-semibold text-slate-700">
                <Radio className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs font-semibold text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Smarter Decisions</span>
              </div>
            </div>
          </div>

          {/* Panoramic Port Ship Image Asset */}
          <div className="relative w-full lg:w-96 h-40 rounded-2xl overflow-hidden border border-pink-200/70 shadow-md group shrink-0">
            <img
              src={portBanner}
              alt="Municipal Smart Port"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-bold text-white drop-shadow">
                Terminal Hub &amp; Gate Logistics Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/70 p-5 shadow-[0_4px_20px_-6px_rgba(236,72,153,0.06)]">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            Quick Actions
          </h2>
          <span className="text-[11px] font-medium text-slate-400">Instant workflow navigation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('gate-in')}
            className="sp-sheen px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-pink-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Gate Entry
          </button>
          <button
            onClick={() => setActiveTab('containers')}
            className="sp-sheen px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <Container className="w-4 h-4" />
            Register Container
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className="sp-sheen px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-rose-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            Generate Invoice
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="sp-sheen px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-green-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-teal-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            View Reports
          </button>
        </div>
      </div>

      {/* Operational KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cargo Containers"
          value={stats.containersCount}
          subtitle="Registered in Port System"
          icon={Container}
          color="cyan"
        />
        <StatCard
          title="Total Gate Entries"
          value={stats.gateEntriesCount}
          subtitle="OCR & Manual Gate Scans"
          icon={ScanLine}
          color="purple"
        />
        <StatCard
          title="Overweight Detections"
          value={stats.overweightCount}
          subtitle="Surcharged via Product Master"
          icon={AlertTriangle}
          color={stats.overweightCount > 0 ? 'peach' : 'emerald'}
        />
        <StatCard
          title="Active Port Gates"
          value={stats.activeGatesCount}
          subtitle="Operational Terminals"
          icon={DoorClosed}
          color="emerald"
        />
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Terminal Revenue (DR/CR)"
          value={`₹${Number(stats.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Gate Clearance & Surcharges"
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Operating Expenses"
          value={`₹${Number(stats.expense).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Weighbridge & Security Costs"
          icon={Receipt}
          color="rose"
        />
        <StatCard
          title="Net Operating Profit"
          value={`₹${Number(stats.netProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Profit & Loss Balance"
          icon={TrendingUp}
          color={stats.netProfit >= 0 ? 'purple' : 'rose'}
        />
      </div>

      {/* Port Overview & Live Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Port Overview Card */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Port Overview
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time infrastructure capacity and operational asset metrics.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-200/60 text-center">
                <DoorClosed className="w-5 h-5 mx-auto text-pink-600 mb-1" />
                <div className="text-lg font-black text-slate-900">{stats.activeGatesCount}</div>
                <div className="text-[10.5px] font-bold uppercase text-slate-500">Active Gates</div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 text-center">
                <Container className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <div className="text-lg font-black text-slate-900">{stats.containersCount}</div>
                <div className="text-[10.5px] font-bold uppercase text-slate-500">Containers</div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/60 text-center">
                <Scale className="w-5 h-5 mx-auto text-teal-600 mb-1" />
                <div className="text-lg font-black text-slate-900">{stats.weighbridgesCount}</div>
                <div className="text-[10.5px] font-bold uppercase text-slate-500">Weighbridges</div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-center">
                <Activity className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                <div className="text-lg font-black text-slate-900">{stats.gateEntriesCount}</div>
                <div className="text-[10.5px] font-bold uppercase text-slate-500">Entries</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-slate-500">
            <span>Spring Boot + MySQL</span>
            <button
              onClick={() => setActiveTab('gates')}
              className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              Gate Master <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Gate Entries Table Card */}
        <div className="lg:col-span-2 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Recent Gate Entries
              </h3>
              <p className="text-xs text-slate-500">Live OCR scanning &amp; weight clearance records</p>
            </div>
            <button
              onClick={() => setActiveTab('gate-in')}
              className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#faf1f5] text-[10.5px] uppercase text-slate-600 font-extrabold border-b border-pink-200/70">
                <tr>
                  <th className="px-3.5 py-2.5">Container No.</th>
                  <th className="px-3.5 py-2.5">Gate</th>
                  <th className="px-3.5 py-2.5">Weight / Limit</th>
                  <th className="px-3.5 py-2.5">Time / Date</th>
                  <th className="px-3.5 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100/70 font-medium">
                {recentGateEntries.length > 0 ? (
                  recentGateEntries.map((entry) => (
                    <tr key={entry.gateEntryId} className="hover:bg-pink-50/50 transition-colors">
                      <td className="px-3.5 py-3 font-mono font-bold text-slate-900">
                        {entry.ocrContainerNumber || `Entry #${entry.gateEntryId}`}
                      </td>
                      <td className="px-3.5 py-3 text-slate-600">
                        Gate #{entry.gateId || 1}
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-600">
                        {entry.actualWeight?.toLocaleString()} / {entry.weightLimit?.toLocaleString()} KG
                      </td>
                      <td className="px-3.5 py-3 text-slate-500 font-mono text-[11px]">
                        {entry.entryTime ? new Date(entry.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        <Badge status={entry.clearanceStatus || (entry.overweight ? 'OVERWEIGHT' : 'CLEARED')} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No gate entries recorded yet in MySQL
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Double-Entry Journals */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Recent Double-Entry Journals
              </h3>
              <p className="text-xs text-slate-500">Automated balanced ledger postings</p>
            </div>
            <button
              onClick={() => setActiveTab('journals')}
              className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              View Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentJournals.length > 0 ? (
              recentJournals.map((j) => (
                <div
                  key={j.journalId}
                  className="p-3 rounded-xl bg-pink-50/40 border border-pink-100/80 hover:border-pink-300 hover:bg-white transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">Journal #{j.journalId}</span>
                      <Badge status={j.journalType} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{j.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-500">{j.journalDate}</span>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Balanced DR/CR</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No journals recorded yet</p>
            )}
          </div>
        </div>

        {/* Recent Invoices & Billing Activity */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 p-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Recent Invoices Generated
              </h3>
              <p className="text-xs text-slate-500">Customer billing &amp; receivables status</p>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              All Invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((inv) => (
                <div
                  key={inv.invoiceId}
                  className="p-3 rounded-xl bg-pink-50/40 border border-pink-100/80 hover:border-pink-300 hover:bg-white transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#fff1f5] text-[#db2777] font-bold font-mono text-xs border border-pink-200/70">
                      INV #{inv.invoiceId}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Sales Order #{inv.salesOrderId}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Date: {inv.invoiceDate || '2026-09-20'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">
                      ₹{Number(inv.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="mt-0.5">
                      <Badge status={inv.status || 'ISSUED'} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No invoices recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;