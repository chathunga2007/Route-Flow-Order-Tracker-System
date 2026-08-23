import React, { useEffect, useState } from 'react';
import { useOrderStore } from './store/orderStore';
import OrderStepper from './components/tracker/OrderStepper';
import DeliveryCard from './components/tracker/DeliveryCard';
import LiveMap from './components/tracker/LiveMap';
import VendorDashboard from './components/vendor/VendorDashboard';
import CreateOrderModal from './components/common/CreateOrderModal';
import { LayoutDashboard, Compass, Database, ShoppingBag, Loader2 } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState('customer');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { orders, activeOrderId, loading, subscribeToOrders, seedInitialData } = useOrderStore();

  useEffect(() => {
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, [subscribeToOrders]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400">Connecting to Firebase Firestore...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /> RouteFlow
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Live Delivery & Order Tracker</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> + Create Order
            </button>

            <button
              onClick={seedInitialData}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition"
            >
              <Database className="w-3.5 h-3.5" /> + Demo
            </button>

            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'customer' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Customer
              </button>
              <button
                onClick={() => setViewMode('vendor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'vendor' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Vendor
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <p className="text-slate-400 text-sm">No live orders found in Firestore database.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition"
            >
              Create First Order
            </button>
          </div>
        ) : viewMode === 'customer' ? (
          <div className="space-y-6">
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
          <VendorDashboard />
        )}

        {/* Customer Order Modal */}
        <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </main>
  );
}