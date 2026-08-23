import React, { useState } from 'react';
import { Phone, MessageSquare, Star, Clock, MapPin } from 'lucide-react';
import DriverActionModal from './DriverActionModal';
import { useOrderStore } from '../../store/orderStore';

export default function DeliveryCard({ driver, eta, address, items = [] }) {
  const [modalType, setModalType] = useState(null);
  const isDark = useOrderStore((state) => state.isDark);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Driver Profile */}
        <div className={`border rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-colors duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={driver?.avatar}
                alt={driver?.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500/40 object-cover"
              />
              <div>
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{driver?.name}</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{driver?.vehicle}</p>
                <span className={`text-[10px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Verified Courier ({driver?.deliveriesCount})
                </span>
              </div>
            </div>
            <span className={`flex items-center gap-1 text-xs font-bold border px-2 py-0.5 rounded-lg ${
              isDark ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {driver?.rating}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <a
              href={`tel:${driver?.phone || '+94712345678'}`}
              className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" /> Call Driver
            </a>
            
            <button
              type="button"
              onClick={() => setModalType('chat')}
              className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className={`md:col-span-2 border rounded-2xl p-5 flex flex-col justify-between shadow-sm space-y-4 transition-colors duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-[11px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estimated Arrival</p>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{eta}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-[11px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Delivery Address</p>
                <p className={`text-xs font-medium truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{address}</p>
              </div>
            </div>
          </div>

          <div>
            <p className={`text-[11px] uppercase font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Order Items</p>
            <div className="space-y-1.5">
              {items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                    {item.qty}x {item.name}
                  </span>
                  <span className={isDark ? 'text-slate-400 font-semibold' : 'text-slate-500 font-semibold'}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DriverActionModal
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        driver={driver}
        type={modalType}
      />
    </>
  );
}