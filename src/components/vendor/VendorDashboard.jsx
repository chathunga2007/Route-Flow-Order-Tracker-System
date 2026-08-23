import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import VendorAnalytics from './VendorAnalytics';
import { Volume2, VolumeX, Bell, Columns, List, ArrowRight } from 'lucide-react';
import { setSoundEnabled, getSoundEnabled, playNotificationSound } from '../../utils/audio';

const KANBAN_STAGES = [
  { id: 'placed', title: 'New Orders' },
  { id: 'preparing', title: 'In Kitchen' },
  { id: 'ready', title: 'Pickup Ready' },
  { id: 'out_for_delivery', title: 'Dispatched' },
  { id: 'delivered', title: 'Delivered' },
];

const STATUS_FLOW = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function VendorDashboard() {
  const { orders, updateOrderStatus, activeOrderId, setActiveOrder, isDark } = useOrderStore();
  const [isAudioOn, setIsAudioOn] = useState(getSoundEnabled());
  const [layoutMode, setLayoutMode] = useState('kanban');

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
      <VendorAnalytics orders={orders} />

      <div className={`border rounded-2xl p-5 shadow-sm space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Controls Toolbar */}
        <div className={`flex flex-wrap justify-between items-center gap-3 pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Kitchen Dispatch Hub</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage orders in real-time</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Switcher */}
            <div className={`flex border p-1 rounded-xl shadow-sm ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setLayoutMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  layoutMode === 'kanban' 
                    ? 'bg-blue-600 text-white shadow' 
                    : (isDark ? 'text-slate-400' : 'text-slate-600')
                }`}
              >
                <Columns className="w-3.5 h-3.5" /> Kanban
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  layoutMode === 'list' 
                    ? 'bg-blue-600 text-white shadow' 
                    : (isDark ? 'text-slate-400' : 'text-slate-600')
                }`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isAudioOn
                  ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                  : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500')
              }`}
            >
              {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isAudioOn ? 'Chime ON' : 'MUTED'}
            </button>

            <button
              type="button"
              onClick={() => playNotificationSound('bell')}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200'
              }`}
              title="Test Chime"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kanban Board Mode */}
        {layoutMode === 'kanban' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 overflow-x-auto no-scrollbar pb-2">
            {KANBAN_STAGES.map((stage) => {
              const stageOrders = orders.filter((o) => o.status === stage.id);
              const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(stage.id) + 1];

              return (
                <div
                  key={stage.id}
                  className={`border rounded-2xl p-3 flex flex-col ${
                    isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`flex justify-between items-center pb-2 border-b mb-3 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <h4 className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{stage.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {stageOrders.length}
                    </span>
                  </div>

                  <div className={`space-y-2.5 flex-1 overflow-y-auto max-h-[440px] pr-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {stageOrders.length === 0 ? (
                      <div className={`h-24 flex items-center justify-center border border-dashed rounded-xl text-[11px] ${
                        isDark ? 'border-slate-800/60 text-slate-600' : 'border-slate-200 text-slate-400'
                      }`}>
                        Empty
                      </div>
                    ) : (
                      stageOrders.map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setActiveOrder(order.id)}
                          className={`p-3 border rounded-xl space-y-2 cursor-pointer transition shadow-sm ${
                            activeOrderId === order.id
                              ? 'border-blue-500 ring-1 ring-blue-500'
                              : (isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300')
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`font-mono font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>#{order.id}</span>
                            <span className="text-[10px] text-emerald-500 font-bold">{order.total}</span>
                          </div>

                          <p className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{order.customer}</p>
                          <p className={`text-[10px] line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {order.items?.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                          </p>

                          {nextStatus && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, nextStatus);
                              }}
                              className={`w-full mt-2 py-1.5 border rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                isDark 
                                  ? 'bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white' 
                                  : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              Move to Next <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table List Mode */
          <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {orders.map((order) => {
              const currentIdx = STATUS_FLOW.indexOf(order.status);
              const nextStatus = STATUS_FLOW[currentIdx + 1];

              return (
                <div
                  key={order.id}
                  onClick={() => setActiveOrder(order.id)}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition ${
                    activeOrderId === order.id 
                      ? (isDark ? 'bg-blue-600/10 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500') 
                      : (isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50')
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>#{order.id}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {order.customer}
                      </span>
                      {order.rating && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${
                          isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          ★ {order.rating}.0 (Tip: Rs.{order.tip || 0})
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {order.items?.map((i) => `${i.qty}x ${i.name}`).join(', ')} •{' '}
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{order.total}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-lg uppercase tracking-wider ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
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
        )}
      </div>
    </div>
  );
}