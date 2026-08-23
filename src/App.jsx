import React, { useEffect, useState } from 'react';
import { useOrderStore } from './store/orderStore';
import OrderStepper from './components/tracker/OrderStepper';
import DeliveryCard from './components/tracker/DeliveryCard';
import LiveMap from './components/tracker/LiveMap';
import VendorDashboard from './components/vendor/VendorDashboard';
import CreateOrderModal from './components/common/CreateOrderModal';
import { LayoutDashboard, Compass, Database, ShoppingBag, Loader2, Code2, Heart } from 'lucide-react';
import { Toaster } from 'sonner';

export default function App() {
  const [viewMode, setViewMode] = useState('customer');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { orders, activeOrderId, setActiveOrder, loading, subscribeToOrders, seedInitialData } = useOrderStore();

  useEffect(() => {
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, [subscribeToOrders]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans px-4 py-4 sm:p-6 md:p-12 flex flex-col justify-between">
      <Toaster position="top-right" richColors theme="dark" />

      <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 flex-1">
        {/* Responsive Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> RouteFlow
                {loading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-1" />}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">Live Delivery & Order Tracker</p>
            </div>

            {/* Mobile View Toggle Switch */}
            <div className="flex sm:hidden bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('customer')}
                className={`p-2 rounded-lg text-xs transition ${
                  viewMode === 'customer' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                }`}
                title="Customer View"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('vendor')}
                className={`p-2 rounded-lg text-xs transition ${
                  viewMode === 'vendor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                }`}
                title="Vendor View"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> + Order
            </button>

            <button
              onClick={seedInitialData}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" /> + Demo
            </button>

            {/* Desktop View Mode Switcher */}
            <div className="hidden sm:flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'customer' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Customer
              </button>
              <button
                onClick={() => setViewMode('vendor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'vendor' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Vendor
              </button>
            </div>
          </div>
        </header>

        {/* Order Selector Tabs (Scrollable on Mobile) */}
        {viewMode === 'customer' && orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-[11px] text-slate-400 uppercase font-bold shrink-0 mr-1">Orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 border transition cursor-pointer ${
                  activeOrderId === o.id
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                #{o.id}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Views */}
        {orders.length === 0 && !loading ? (
          <div className="p-8 sm:p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <p className="text-slate-400 text-xs sm:text-sm">No live orders found in database.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition"
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
            <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
              Loading active tracker...
            </div>
          )
        ) : (
          <VendorDashboard />
        )}

        <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {/* Developer Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-8 pb-2 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow">
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] sm:text-xs text-slate-400">
            Crafted with <Heart className="w-3 h-3 text-red-500 inline fill-red-500 mx-0.5" /> by{' '}
            <span className="text-slate-200 font-bold">Chathunga Bimsara</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>
      </footer>
    </main>
  );
}