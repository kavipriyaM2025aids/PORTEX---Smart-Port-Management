import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Calendar, Bell, ChevronDown, RefreshCw, Database
} from 'lucide-react';
import apiService from '../api/apiService';

const Header = ({ activeTab, setActiveTab, onRefresh, isRefreshing, role, setRole, onLogout }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchVal, setSearchVal] = useState('');

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    return JSON.parse(localStorage.getItem('portex_read_notifications') || '[]');
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications based on role
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let notifs = [];
        // Fetch financial data (both roles)
        try {
          const invoices = await apiService.getInvoices();
          if (Array.isArray(invoices)) {
            const pending = invoices.filter(i => i.status !== 'PAID').slice(-2);
            pending.forEach(i => notifs.push({
              id: `inv-${i.id}`,
              title: 'Customer invoice pending',
              desc: `Invoice #${i.invoiceNumber || i.id} is awaiting payment.`
            }));
          }
        } catch (e) {}

        try {
          const bills = await apiService.getVendorBills();
          if (Array.isArray(bills)) {
            const pending = bills.filter(b => b.status === 'POSTED' || b.status === 'DRAFT').slice(-2);
            pending.forEach(b => notifs.push({
              id: `bill-${b.id}`,
              title: 'Vendor bill pending',
              desc: `Vendor Bill #${b.billNumber || b.id} requires payment.`
            }));
          }
        } catch (e) {}

        // Fetch operational data (Admin only)
        if (role === 'ADMIN') {
          try {
            const gateEntries = await apiService.getGateEntries();
            if (Array.isArray(gateEntries)) {
              const recent = gateEntries.slice(-2);
              recent.forEach(g => notifs.push({
                id: `gate-${g.id}`,
                title: 'Gate Entry Recorded',
                desc: `Gate Entry #${g.id} requires attention.`
              }));
            }
          } catch (e) {}
        }
        
        // Ensure uniqueness and set
        setNotifications(notifs);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    
    // Slight delay to allow backend boot if needed, then fetch
    setTimeout(fetchNotifications, 500);
    const interval = setInterval(fetchNotifications, 30000); // 30s
    return () => clearInterval(interval);
  }, [role, isRefreshing]);

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      // mark all current as read
      const newReadIds = [...new Set([...readIds, ...notifications.map(n => n.id)])];
      setReadIds(newReadIds);
      localStorage.setItem('portex_read_notifications', JSON.stringify(newReadIds));
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      );
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative z-20 h-[66px] shrink-0 px-6 flex items-center justify-between gap-4 border-b border-pink-200/50 bg-gradient-to-r from-white/80 via-[#fff5f8]/75 to-purple-50/70 backdrop-blur-md shadow-[0_2px_15px_-4px_rgba(236,72,153,0.06)]">
      <div className="relative w-full max-w-sm sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
        <input
          type="text"
          placeholder="Search anything..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/80 hover:bg-white focus:bg-white border border-pink-200/70 focus:border-pink-500 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/70 border border-pink-200/60 shadow-sm text-slate-700">
          <Calendar className="w-4 h-4 text-pink-500 shrink-0" />
          <div className="flex flex-col text-right leading-none">
            <span className="text-[11px] font-semibold text-slate-700">{currentDate || '23 Apr 2025'}</span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5">{currentTime || '02:45 PM'}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-[11px] font-semibold text-emerald-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 sp-live-dot" />
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-900/80">MySQL Linked</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-white/80 hover:bg-pink-50 border border-pink-200/70 text-slate-600 hover:text-pink-600 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          title="Refresh real-time data from MySQL"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-pink-600' : ''}`} />
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={handleNotifClick}
            className="relative p-2 rounded-xl bg-white/80 hover:bg-pink-50 border border-pink-200/70 text-slate-600 hover:text-pink-600 transition-all cursor-pointer shadow-sm"
            title="System notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
          
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-pink-100 transition-all z-50">
              <div className="px-4 py-2.5 border-b border-pink-50 bg-pink-50/30">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h3>
              </div>
              <div className="py-1">
                {notifications.length === 0 ? (
                  <div className="px-4 py-4 text-center text-xs text-slate-500 font-medium">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 border-b border-pink-50/50 hover:bg-pink-50/40 transition-colors cursor-default">
                      <p className="text-[11px] font-bold text-slate-800">{n.title}</p>
                      <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/80 border border-pink-200/70 shadow-sm cursor-pointer hover:bg-white transition-all group relative">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
            {role === 'ADMIN' ? 'A' : 'T'}
          </div>
          <div className="hidden sm:block leading-tight text-left">
            <p className="text-[11.5px] font-bold text-slate-800 uppercase">{role}</p>
            <p className="text-[9.5px] text-emerald-600 font-semibold flex items-center gap-1">
              {role === 'ADMIN' ? 'Port Logistics Director' : 'Terminal Accountant'}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-pink-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden z-50">
            {role === 'ADMIN' ? (
              <button onClick={() => {
                setRole('ACCOUNTANT');
                const accountantTabs = ['dashboard', 'sales-orders', 'invoices', 'payments', 'purchase-orders', 'vendor-bills', 'vendor-payments', 'accounts', 'journals', 'analytic-accounts', 'budgets', 'reports'];
                if (!accountantTabs.includes(activeTab)) {
                  setActiveTab('dashboard');
                }
              }} className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-pink-50 border-b border-pink-50 transition-colors">
                Switch to ACCOUNTANT
              </button>
            ) : (
              <button onClick={() => setRole('ADMIN')} className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-pink-50 border-b border-pink-50 transition-colors">
                Switch to ADMIN
              </button>
            )}
            <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-[12px] text-rose-600 hover:bg-rose-50 font-bold transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
