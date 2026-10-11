import React, { useState } from 'react';
import {
  Anchor,
  LayoutDashboard,
  ScanLine,
  Scale,
  Container,
  DoorClosed,
  ShoppingCart,
  Receipt,
  CreditCard,
  ShoppingBag,
  FileSpreadsheet,
  Banknote,
  Users,
  Package,
  BookOpen,
  FileText,
  PieChart,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import portSilhouette from '../assets/port_silhouette.jpg';

const Sidebar = ({ activeTab, setActiveTab, role }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'gate-in', label: 'Gate Entry / OCR', icon: ScanLine, highlight: true },
        { id: 'weighbridge', label: 'Weighbridge', icon: Scale },
        { id: 'containers', label: 'Containers', icon: Container },
        { id: 'gates', label: 'Gate Master', icon: DoorClosed }
      ]
    },
    {
      title: 'COMMERCIAL & SALES',
      items: [
        { id: 'sales-orders', label: 'Sales Orders', icon: ShoppingCart },
        { id: 'invoices', label: 'Customer Invoices', icon: Receipt },
        { id: 'payments', label: 'Customer Payments', icon: CreditCard }
      ]
    },
    {
      title: 'PURCHASE & VENDOR',
      items: [
        { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingBag },
        { id: 'vendor-bills', label: 'Vendor Bills', icon: FileSpreadsheet },
        { id: 'vendor-payments', label: 'Vendor Payments', icon: Banknote }
      ]
    },
    {
      title: 'MASTER & ACCOUNTING',
      items: [
        { id: 'contacts', label: 'Contact Master', icon: Users },
        { id: 'products', label: 'Product Master', icon: Package },
        { id: 'accounts', label: 'Accounts', icon: BookOpen },
        { id: 'journals', label: 'Journals', icon: FileText },
        { id: 'analytic-accounts', label: 'Analytic Accounts', icon: PieChart },
        { id: 'budgets', label: 'Budgets', icon: Target }
      ]
    },
    {
      title: 'REPORTS & ANALYTICS',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
      ]
    }
  ];

  
  const filteredNavSections = navSections.map(section => {
    if (role === 'ACCOUNTANT') {
      const hiddenIds = ['containers', 'gates', 'gate-in', 'weighbridge', 'contacts', 'products'];
      const filteredItems = section.items.filter(item => !hiddenIds.includes(item.id));
      return { ...section, items: filteredItems };
    }
    return section;
  }).filter(section => section.items.length > 0);

  return (
    <aside
      className={`relative flex flex-col h-screen shrink-0 select-none overflow-hidden transition-[width] duration-300 ease-out z-20 ${
        collapsed ? 'w-[80px]' : 'w-[268px]'
      }`}
      style={{
        background: 'linear-gradient(185deg, #1b0d24 0%, #150a1d 40%, #1d0e26 75%, #120718 100%)',
        boxShadow: '8px 0 35px -10px rgba(20, 5, 25, 0.7)',
        borderRight: '1px solid rgba(244, 114, 182, 0.12)'
      }}
    >
      {/* Subtle Aurora Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-16 w-56 h-56 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-20 w-48 h-48 rounded-full bg-purple-600/15 blur-3xl" />

      {/* Brand Header */}
      <div className="relative z-10 px-4 py-4.5 border-b border-pink-500/15">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="relative w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-[0_4px_18px_rgba(236,72,153,0.5)]">
            <Anchor className="w-5 h-5 text-white drop-shadow" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1a0c24]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden sp-anim-fade">
              <h1 className="text-[17px] font-black tracking-wider text-white leading-none">
                PORTEX
              </h1>
              <p className="text-[10px] font-semibold tracking-wide text-pink-200/90 mt-1 leading-tight">
                Municipal Smart Port
              </p>
              <p className="text-[9px] font-medium tracking-wider uppercase text-purple-200/60 leading-tight">
                Gate &amp; Cargo System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute top-[68px] -right-3 z-30 w-6 h-6 rounded-full bg-[#2a1334] border border-pink-400/30 text-pink-200 hover:text-white hover:bg-pink-600 flex items-center justify-center transition-all cursor-pointer shadow-md"
        title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation List */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3.5 space-y-4 sp-sidebar">
        {filteredNavSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed ? (
              <h2 className="px-3 mb-1.5 flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-pink-200/50">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
                {section.title}
              </h2>
            ) : (
              <div className="mx-2 mb-2 h-px bg-white/10" />
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`group relative w-full flex items-center rounded-xl transition-all duration-200 ease-out ${
                    collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'
                  } ${
                    isActive
                      ? 'text-white'
                      : 'text-purple-200/70 hover:text-white hover:translate-x-1 hover:bg-white/[0.05]'
                  }`}
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(90deg, #f43f7e 0%, #db2777 45%, #9d174d 100%)',
                          boxShadow: '0 8px 24px -6px rgba(244, 63, 126, 0.65), inset 0 1px 1px rgba(255,255,255,0.25)',
                          border: '1px solid rgba(255, 255, 255, 0.25)'
                        }
                      : undefined
                  }
                >
                  <Icon
                    className={`relative w-[17px] h-[17px] shrink-0 transition-transform duration-200 ${
                      isActive
                        ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]'
                        : 'text-purple-200/60 group-hover:text-pink-200'
                    }`}
                  />

                  {!collapsed && (
                    <>
                      <span className={`relative truncate text-[12px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                      {item.highlight && !isActive && (
                        <span className="ml-auto px-1.5 py-[1px] rounded text-[8.5px] font-bold tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/30">
                          LIVE
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.highlight && !isActive && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 sp-live-dot" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Silhouette Port Banner at Bottom */}
      {!collapsed && (
        <div className="relative z-10 mx-3 mb-2 rounded-xl overflow-hidden border border-pink-500/20 shadow-lg group">
          <img
            src={portSilhouette}
            alt="Port Silhouette"
            className="w-full h-20 object-cover brightness-95 opacity-85 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160a20] via-transparent to-transparent flex flex-col justify-end p-2.5">
            <p className="text-[11px] font-bold text-white leading-tight drop-shadow">
              Smarter Ports
            </p>
            <p className="text-[9px] font-medium text-pink-200/90 leading-tight flex items-center gap-1">
              <span>Sustainable Tomorrow</span>
              <span className="w-4 h-[1.5px] bg-pink-400 rounded-full inline-block" />
            </p>
          </div>
        </div>
      )}

      {/* Backend & DB Link Status */}
      <div className="relative z-10 px-3 py-2.5 border-t border-pink-500/15 bg-black/30">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1 py-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 sp-live-dot" title="Spring Boot 8080 · MySQL Linked" />
            <span className="text-[8.5px] font-mono text-purple-200/60">8080</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 sp-live-dot" />
              Spring Boot 8080
            </span>
            <span className="text-purple-200/50 font-medium">MySQL Linked</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;