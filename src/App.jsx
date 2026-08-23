import React, { useEffect, useState } from 'react';
import { useOrderStore } from './store/orderStore';
import OrderStepper from './components/tracker/OrderStepper';
import DeliveryCard from './components/tracker/DeliveryCard';
import LiveMap from './components/tracker/LiveMap';
import VendorDashboard from './components/vendor/VendorDashboard';
import CreateOrderModal from './components/common/CreateOrderModal';
import { LayoutDashboard, Compass, Database, ShoppingBag, Loader2, Code2, Heart, Moon, Sun } from 'lucide-react';
import { Toaster } from 'sonner';

export default function App() {
  const [viewMode, setViewMode] = useState('customer');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { orders, activeOrderId, setActiveOrder, loading, subscribeToOrders, seedInitialData, isDark, toggleTheme } = useOrderStore();

  useEffect(() => {
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, [subscribeToOrders]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  return (
    <main className={`min-h-screen font-sans px-4 py-4 sm:p-6 md:p-12 flex flex-col justify-between transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <Toaster position="top-right" richColors theme={isDark ? 'dark' : 'light'} />

      <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 flex-1">
        {/* Header */}
        <header className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> RouteFlow
                {loading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-1" />}
              </h1>
              <p className={`text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Live Delivery & Order Tracker
              </p>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-xl border shadow-sm cursor-pointer ${
                  isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className={`flex border p-1 rounded-xl shadow-sm ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <button
                  onClick={() => setViewMode('customer')}
                  className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                    viewMode === 'customer' ? 'bg-blue-600 text-white shadow' : (isDark ? 'text-slate-400' : 'text-slate-500')
                  }`}
                >
                  <Compass className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('vendor')}
                  className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                    viewMode === 'vendor' ? 'bg-blue-600 text-white shadow' : (isDark ? 'text-slate-400' : 'text-slate-500')
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Toolbar */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> + Order
            </button>

            <button
              onClick={seedInitialData}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> + Demo
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={`hidden sm:flex p-2.5 border rounded-xl transition cursor-pointer shadow-sm ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`hidden sm:flex border p-1 rounded-xl shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button
                onClick={() => setViewMode('customer')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'customer'
                    ? 'bg-blue-600 text-white shadow-md'
                    : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Customer
              </button>
              <button
                onClick={() => setViewMode('vendor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'vendor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Vendor
              </button>
            </div>
          </div>
        </header>

        {/* Tab Selector */}
        {viewMode === 'customer' && orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className={`text-[11px] uppercase font-bold shrink-0 mr-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Orders:
            </span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 border transition cursor-pointer ${
                  activeOrderId === o.id
                    ? (isDark ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' : 'bg-blue-50 border-blue-500 text-blue-600 font-bold')
                    : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900')
                }`}
              >
                #{o.id}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Views */}
        {orders.length === 0 && !loading ? (
          <div className={`p-8 sm:p-12 text-center border rounded-2xl space-y-3 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className={isDark ? 'text-slate-400 text-xs sm:text-sm' : 'text-slate-500 text-xs sm:text-sm'}>
              No live orders found in database.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition cursor-pointer"
            >
              Create First Order
            </button>
          </div>
        ) : viewMode === 'customer' ? (
          activeOrder ? (
            <div className="space-y-4 sm:space-y-6">
              <OrderStepper currentStatus={activeOrder.status} />
              <LiveMap />
              <DeliveryCard
                driver={activeOrder.driver}
                eta={activeOrder.eta}
                address={activeOrder.address}
                items={activeOrder.items}
              />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
              Loading active tracker...
            </div>
          )
        ) : (
          <VendorDashboard />
        )}

        <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-8 pb-2 text-center">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border backdrop-blur-md shadow-sm ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          <span className={`text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Crafted with <Heart className="w-3 h-3 text-red-500 inline fill-red-500 mx-0.5" /> by{' '}
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Chathunga Bimsara</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </div>
      </footer>
    </main>
  );
}