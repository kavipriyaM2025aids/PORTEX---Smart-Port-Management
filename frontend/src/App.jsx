import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import GateEntryPage from './pages/GateEntryPage';
import WeighbridgePage from './pages/WeighbridgePage';
import ContainersPage from './pages/ContainersPage';
import GatesPage from './pages/GatesPage';
import SalesOrdersPage from './pages/SalesOrdersPage';
import InvoicesPage from './pages/InvoicesPage';
import PaymentsPage from './pages/PaymentsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import VendorBillsPage from './pages/VendorBillsPage';
import VendorPaymentsPage from './pages/VendorPaymentsPage';
import ContactsPage from './pages/ContactsPage';
import ProductsPage from './pages/ProductsPage';
import AccountsPage from './pages/AccountsPage';
import JournalsPage from './pages/JournalsPage';
import AnalyticAccountsPage from './pages/AnalyticAccountsPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [role, setRole] = useState(() => {
    return localStorage.getItem('portex_role') || 'ADMIN';
  });
  
  const handleLogout = () => {
    setRole('ADMIN');
    localStorage.setItem('portex_role', 'ADMIN');
    setShowSplash(true);
    setActiveTab('dashboard');
  };
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshKey} setActiveTab={setActiveTab} />;
      case 'gate-in':
        return <GateEntryPage key={refreshKey} />;
      case 'weighbridge':
        return <WeighbridgePage key={refreshKey} />;
      case 'containers':
        return <ContainersPage key={refreshKey} />;
      case 'gates':
        return <GatesPage key={refreshKey} />;
      case 'sales-orders':
        return <SalesOrdersPage key={refreshKey} />;
      case 'invoices':
        return <InvoicesPage key={refreshKey} />;
      case 'payments':
        return <PaymentsPage key={refreshKey} />;
      case 'purchase-orders':
        return <PurchaseOrdersPage key={refreshKey} />;
      case 'vendor-bills':
        return <VendorBillsPage key={refreshKey} />;
      case 'vendor-payments':
        return <VendorPaymentsPage key={refreshKey} />;
      case 'contacts':
        return <ContactsPage key={refreshKey} />;
      case 'products':
        return <ProductsPage key={refreshKey} />;
      case 'accounts':
        return <AccountsPage key={refreshKey} />;
      case 'journals':
        return <JournalsPage key={refreshKey} />;
      case 'analytic-accounts':
        return <AnalyticAccountsPage key={refreshKey} />;
      case 'budgets':
        return <BudgetsPage key={refreshKey} />;
      case 'reports':
        return <ReportsPage key={refreshKey} />;
      default:
        return <Dashboard key={refreshKey} setActiveTab={setActiveTab} />;
    }
  };

  

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="flex h-screen bg-transparent text-[#30243D] overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />

      {/* Main Content Area with Atmospheric Pink/Lavender Pastel Gradient Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#fdf5f8]/70 text-[#30243D]">
        {/* Decorative Blurred Gradient Shapes for Soft Depth */}
        <div className="sp-blob-1" />
        <div className="sp-blob-2" />
        <div className="sp-blob-3" />

        {/* Top Navbar */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={handleRefresh} isRefreshing={isRefreshing} role={role} setRole={(r) => { setRole(r); localStorage.setItem('portex_role', r); }} onLogout={handleLogout} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6 relative z-10 text-[#30243D]">
          <div key={activeTab} className="max-w-[1440px] mx-auto pb-14 sp-anim-rise">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

export default App;
