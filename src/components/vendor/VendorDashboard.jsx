import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import VendorAnalytics from './VendorAnalytics';
import { Volume2, VolumeX, Bell } from 'lucide-react';
import { setSoundEnabled, getSoundEnabled, playNotificationSound } from '../../utils/audio';

const STATUS_FLOW = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function VendorDashboard() {
  const { orders, updateOrderStatus, activeOrderId, setActiveOrder } = useOrderStore();
  const [isAudioOn, setIsAudioOn] = useState(getSoundEnabled());

  const toggleAudio = () => {
    const nextState = !isAudioOn;
    setIsAudioOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playNotificationSound('bell');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Analytics */}
      <VendorAnalytics orders={orders} />

      {/* 2. Kitchen Live Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="font-bold text-lg text-white">Live Kitchen Queue</h3>
            <p className="text-xs text-slate-400">Click ticket to focus customer tracking</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle Controller */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isAudioOn
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isAudioOn ? 'Kitchen Chime: ON' : 'Kitchen Chime: MUTED'}
            </button>

            <button
              type="button"
              onClick={() => playNotificationSound('bell')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Test Kitchen Bell"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
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
                    {order.rating && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                        ★ {order.rating}.0 (Tip: Rs.{order.tip || 0})
                      </span>
                    )}
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