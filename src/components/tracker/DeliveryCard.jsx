import React, { useState } from 'react';
import { Phone, MessageSquare, Star, Clock, MapPin } from 'lucide-react';
import DriverActionModal from './DriverActionModal';

export default function DeliveryCard({ driver, eta, address, items = [] }) {
  const [modalType, setModalType] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Driver Profile Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={driver?.avatar}
                alt={driver?.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500/40 object-cover"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{driver?.name}</h4>
                <p className="text-[11px] text-slate-400">{driver?.vehicle}</p>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Verified Courier ({driver?.deliveriesCount})
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 fill-amber-400" /> {driver?.rating}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalType('call')}
              className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" /> Call Driver
            </button>
            <button
              type="button"
              onClick={() => setModalType('chat')}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="md:col-span-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Estimated Arrival</p>
                <p className="text-sm font-bold text-white">{eta}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Delivery Address</p>
                <p className="text-xs font-medium text-white truncate max-w-[200px]">{address}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold mb-2">Order Items</p>
            <div className="space-y-1.5">
              {items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">
                    {item.qty}x {item.name}
                  </span>
                  <span className="text-slate-400 font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Call / Chat Modal */}
      <DriverActionModal
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        driver={driver}
        type={modalType}
      />
    </>
  );
}