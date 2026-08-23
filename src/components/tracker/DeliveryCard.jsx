import React from 'react';
import { Phone, MessageSquare, ShieldCheck, MapPin, Clock, Star } from 'lucide-react';

export default function DeliveryCard({
  driver = {
    name: 'Kasun Perera',
    rating: 4.9,
    vehicle: 'Honda CB Hornet (WP BD-4821)',
    phone: '+94 77 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    deliveriesCount: '1,420+'
  },
  eta = '18 - 25 mins',
  address = 'No. 45, Galle Road, Colombo 03',
  items = [
    { name: 'Double Cheese Burger', qty: 2, price: 'Rs. 2,400' },
    { name: 'Crispy Fries (L)', qty: 1, price: 'Rs. 650' },
    { name: 'Coca-Cola Zero (500ml)', qty: 2, price: 'Rs. 500' },
  ]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Driver Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned Driver</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {driver.rating}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <h4 className="font-bold text-lg text-white">{driver.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{driver.vehicle}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Courier ({driver.deliveriesCount})
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${driver.phone}`}
            className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-600/20"
          >
            <Phone className="w-3.5 h-3.5" /> Call Driver
          </a>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Message
          </button>
        </div>
      </div>

      {/* Order Summary & Destination Details */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Estimated Arrival</p>
              <p className="text-base font-bold text-white mt-0.5">{eta}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Delivery Address</p>
              <p className="text-sm font-medium text-slate-200 mt-0.5 line-clamp-1">{address}</p>
            </div>
          </div>
        </div>

        {/* Item list */}
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Order Items</h5>
          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-slate-300">
                  <span className="font-semibold text-blue-400 mr-2">{item.qty}x</span>
                  {item.name}
                </span>
                <span className="font-semibold text-slate-200">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}