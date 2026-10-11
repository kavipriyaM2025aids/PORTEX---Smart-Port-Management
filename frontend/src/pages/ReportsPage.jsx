import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  RefreshCw,
  CheckCircle2,
  IndianRupee,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import apiService from '../api/apiService';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('pnl'); // 'pnl' | 'balance-sheet' | 'budget'
  const [pnlData, setPnlData] = useState({ totalRevenue: 0, totalExpense: 0, netProfitOrLoss: 0 });
  const [balanceSheetData, setBalanceSheetData] = useState({ totalAssets: 0, totalLiabilities: 0, totalEquity: 0 });
  const [budgetReportData, setBudgetReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [pnl, balanceSheet, budget] = await Promise.all([
        apiService.getProfitAndLoss(),
        apiService.getBalanceSheet(),
        apiService.getBudgetReport()
      ]);
      setPnlData(pnl || { totalRevenue: 0, totalExpense: 0, netProfitOrLoss: 0 });
      setBalanceSheetData(balanceSheet || { totalAssets: 0, totalLiabilities: 0, totalEquity: 0 });
      setBudgetReportData(budget || []);
    } catch (err) {
      console.error('Failed to load report data', err);
      setAlert({
        type: 'error',
        message: 'Failed to fetch financial reports. Please verify Spring Boot APIs are running.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const isBalanceSheetBalanced =
    Math.abs((balanceSheetData.totalAssets || 0) - ((balanceSheetData.totalLiabilities || 0) + (balanceSheetData.totalEquity || 0))) < 0.01;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hover:text-pink-600 transition-colors cursor-pointer">Reports &amp; Analytics</span>
        <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
        <span className="text-slate-800 font-bold">Financial Reports</span>
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
      <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-[0_10px_30px_-8px_rgba(236,72,153,0.12)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Municipal Port Financial Reports
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time Profit &amp; Loss statement, Double-Entry Balance Sheet, and Budget Variance reports calculated directly from MySQL.
            </p>
          </div>
        </div>

        <button
          onClick={fetchReports}
          className="sp-sheen px-5 py-2.5 rounded-full bg-white border border-pink-200 text-slate-700 hover:text-pink-600 text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-600' : ''}`} />
          Recalculate Reports
        </button>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-white/80 border border-pink-200/70 shadow-xs">
        <button
          onClick={() => setActiveTab('pnl')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pnl'
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-sm shadow-pink-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-pink-50/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          1. Profit &amp; Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('balance-sheet')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'balance-sheet'
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-sm shadow-pink-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-pink-50/50'
          }`}
        >
          <Scale className="w-4 h-4" />
          2. Balance Sheet
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-sm shadow-pink-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-pink-50/50'
          }`}
        >
          <Target className="w-4 h-4" />
          3. Budget Report
        </button>
      </div>

      {/* TAB 1: PROFIT & LOSS */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Operating Revenue"
              value={`₹${Number(pnlData.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              subtitle="Gate Clearance & Surcharges"
              icon={TrendingUp}
              color="emerald"
            />
            <StatCard
              title="Total Operating Expense"
              value={`₹${Number(pnlData.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              subtitle="Weighbridge & Security Costs"
              icon={TrendingDown}
              color="rose"
            />
            <StatCard
              title="Net Operating Profit / Loss"
              value={`₹${Number(pnlData.netProfitOrLoss || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              subtitle="Total Revenue − Total Expense"
              icon={BarChart3}
              color={pnlData.netProfitOrLoss >= 0 ? 'purple' : 'rose'}
            />
          </div>

          <div className="rounded-2xl border border-pink-200/80 bg-white/90 p-6 backdrop-blur-md space-y-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)]">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Profit &amp; Loss Statement Breakdown (GET /api/port/reports/profit-loss)</h3>
                <p className="text-xs text-slate-500">Calculated from INCOME and EXPENSE journal entries in MySQL</p>
              </div>
              <Badge status={pnlData.netProfitOrLoss >= 0 ? 'SURPLUS' : 'DEFICIT'} variant={pnlData.netProfitOrLoss >= 0 ? 'success' : 'danger'} />
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-pink-50/40 border border-pink-100">
                <span className="text-slate-700 font-sans font-medium">1. Terminal Operating Revenue (Credits − Debits)</span>
                <span className="font-bold text-emerald-700">
                  +₹{Number(pnlData.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-pink-50/40 border border-pink-100">
                <span className="text-slate-700 font-sans font-medium">2. Maintenance &amp; Security Expenses (Debits − Credits)</span>
                <span className="font-bold text-rose-600">
                  -₹{Number(pnlData.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-[#fff1f5] border border-pink-200 text-base font-bold">
                <span className="text-slate-900 font-sans">Net Operating Profit / (Loss):</span>
                <span className={pnlData.netProfitOrLoss >= 0 ? 'text-pink-700' : 'text-rose-600'}>
                  ₹{Number(pnlData.netProfitOrLoss || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BALANCE SHEET */}
      {activeTab === 'balance-sheet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Assets (DR - CR)"
              value={`₹${Number(balanceSheetData.totalAssets || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              subtitle="OCR, Weighbridge, Cash/Bank, Receivables"
              icon={ShieldCheck}
              color="cyan"
            />
            <StatCard
              title="Total Liabilities (CR - DR)"
              value={`₹${Number(balanceSheetData.totalLiabilities || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              subtitle="Maintenance & Security Payables"
              icon={Layers}
              color="peach"
            />
            <StatCard
              title="Total Port Equity (CR - DR)"
              value={`₹${Number(balanceSheetData.totalEquity || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              subtitle="Port Operating Capital"
              icon={IndianRupee}
              color="purple"
            />
          </div>

          <div className="rounded-2xl border border-pink-200/80 bg-white/90 p-6 backdrop-blur-md space-y-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)]">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Double-Entry Balance Sheet (GET /api/port/reports/balance-sheet)</h3>
                <p className="text-xs text-slate-500">Fundamental Accounting Equation: Assets = Liabilities + Equity</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={isBalanceSheetBalanced ? 'BALANCED' : 'UNBALANCED'} variant={isBalanceSheetBalanced ? 'success' : 'warning'} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assets Side */}
              <div className="p-4.5 rounded-xl bg-pink-50/40 border border-pink-100 space-y-3">
                <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                  <span className="font-bold text-pink-700 uppercase text-xs tracking-wider">Port Assets</span>
                  <span className="font-mono text-xs text-slate-500">Account Type: ASSET</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>• Gate OCR Assets</span>
                    <span className="font-mono text-slate-500">Account 1001</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• Weighbridge Assets</span>
                    <span className="font-mono text-slate-500">Account 1002</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• Cash / Bank Account</span>
                    <span className="font-mono text-slate-500">Account 1003</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• Customer Receivables</span>
                    <span className="font-mono text-slate-500">Account 1010</span>
                  </div>
                </div>
                <div className="flex justify-between pt-3 border-t border-pink-100 font-mono font-bold text-sm text-pink-700">
                  <span>Total Assets:</span>
                  <span>₹{Number(balanceSheetData.totalAssets || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Liabilities & Equity Side */}
              <div className="p-4.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <span className="font-bold text-purple-700 uppercase text-xs tracking-wider">Liabilities &amp; Equity</span>
                  <span className="font-mono text-xs text-slate-500">Types: LIABILITY / EQUITY</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>• Maintenance Payables</span>
                    <span className="font-mono text-slate-500">Account 2001</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• Security Liabilities</span>
                    <span className="font-mono text-slate-500">Account 2002</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>• Port Operating Capital</span>
                    <span className="font-mono text-slate-500">Account 3001</span>
                  </div>
                </div>
                <div className="flex justify-between pt-3 border-t border-purple-100 font-mono font-bold text-sm text-purple-700">
                  <span>Liabilities + Equity:</span>
                  <span>
                    ₹{Number((balanceSheetData.totalLiabilities || 0) + (balanceSheetData.totalEquity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET REPORT */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-pink-200/80 bg-white/90 p-6 backdrop-blur-md space-y-5 shadow-[0_8px_30px_-6px_rgba(236,72,153,0.08)]">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Budget Variance Analysis (GET /api/port/reports/budget)</h3>
                <p className="text-xs text-slate-500">Real-time revenue &amp; expense variances calculated per budget record</p>
              </div>
            </div>

            <div className="space-y-4">
              {budgetReportData.length > 0 ? (
                budgetReportData.map((item, idx) => (
                  <div key={idx} className="p-4.5 rounded-xl bg-pink-50/40 border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{item.budgetName}</span>
                        <span className="text-xs text-slate-500 block mt-0.5">Financial Year: {item.financialYear}</span>
                      </div>
                      <Badge status={item.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-pink-100 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-white border border-pink-100">
                        <span className="text-slate-500 block text-[10px] uppercase">Planned Revenue</span>
                        <span className="font-bold text-slate-800">₹{Number(item.plannedRevenue || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-pink-100">
                        <span className="text-slate-500 block text-[10px] uppercase">Actual Revenue</span>
                        <span className="font-bold text-emerald-700">₹{Number(item.actualRevenue || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-pink-100">
                        <span className="text-slate-500 block text-[10px] uppercase">Planned Expense</span>
                        <span className="font-bold text-slate-800">₹{Number(item.plannedExpense || 0).toLocaleString()}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-pink-100">
                        <span className="text-slate-500 block text-[10px] uppercase">Actual Expense</span>
                        <span className="font-bold text-rose-600">₹{Number(item.actualExpense || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2 border-t border-pink-100 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600">Revenue Variance:</span>
                        <span className={`font-bold ${item.revenueVariance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {item.revenueVariance >= 0 ? '+' : ''}₹{Number(item.revenueVariance || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600">Expense Variance:</span>
                        <span className={`font-bold ${item.expenseVariance <= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.expenseVariance >= 0 ? '+' : ''}₹{Number(item.expenseVariance || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-8 text-center">No budget variance data found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;