import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import VendorAnalytics from './VendorAnalytics';

const STATUS_FLOW = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function VendorDashboard() {
  const { orders, updateOrderStatus, activeOrderId, setActiveOrder } = useOrderStore();

  return (
    <div className="space-y-8">
      {/* 1. Analytics & Charts */}
      <VendorAnalytics orders={orders} />

      {/* 2. Kitchen Live Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-white">Live Kitchen Queue</h3>
            <p className="text-xs text-slate-400">Click ticket to focus customer view</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
            Realtime DB Active
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {orders.map((order) => {
            const currentIdx = STATUS_FLOW.indexOf(order.status);
            const nextStatus = STATUS_FLOW[currentIdx + 1];

            return (
              <div
                key={order.id}
                onClick={() => setActiveOrder(order.id)}
                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition ${
                  activeOrderId === order.id ? 'bg-blue-600/10 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white text-base">#{order.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {order.customer}
                    </span>
                    <span className="text-xs text-slate-500">{order.timestamp || 'Just now'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {order.items?.map((i) => `${i.qty}x ${i.name}`).join(', ')} •{' '}
                    <span className="text-slate-200 font-medium">{order.total}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 uppercase tracking-wider">
                    {order.status?.replace(/_/g, ' ')}
                  </span>

                  {nextStatus && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, nextStatus);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition cursor-pointer"
                    >
                      Advance to {nextStatus.replace(/_/g, ' ')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}