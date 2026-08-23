import React from 'react';
import { useOrderStore } from '../../store/orderStore';
import { ChefHat, Bike, CheckCircle, Clock } from 'lucide-react';

const STATUS_FLOW = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function VendorDashboard() {
  const { orders, updateOrderStatus, activeOrderId, setActiveOrder } = useOrderStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Active Orders</p>
          <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">In Kitchen</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {orders.filter((o) => o.status === 'preparing').length}
          </p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold uppercase">Out on Road</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {orders.filter((o) => o.status === 'out_for_delivery').length}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">Live Kitchen Queue</h3>
          <span className="text-xs text-slate-400">Syncing live updates</span>
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
                    <span className="font-mono font-bold text-white text-base">{order.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {order.customer}
                    </span>
                    <span className="text-xs text-slate-500">{order.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {order.items.map((i) => `${i.qty}x ${i.name}`).join(', ')} •{' '}
                    <span className="text-slate-200 font-medium">{order.total}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 uppercase tracking-wider">
                    {order.status.replace('_', ' ')}
                  </span>

                  {nextStatus && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, nextStatus);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
                    >
                      Advance to {nextStatus.replace('_', ' ')}
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