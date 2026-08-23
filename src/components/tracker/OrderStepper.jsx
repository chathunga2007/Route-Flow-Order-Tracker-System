import React from 'react';
import { Check, Clock, PackageCheck, ChefHat, Bike, Home } from 'lucide-react';

const STAGES = [
  { id: 'placed', label: 'Order Placed', icon: Clock, desc: 'Your order has been received' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Kitchen is preparing your items' },
  { id: 'ready', label: 'Ready for Pickup', icon: PackageCheck, desc: 'Driver is assigning' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'On the way to your door' },
  { id: 'delivered', label: 'Delivered', icon: Home, desc: 'Order completed safely' },
];

export default function OrderStepper({ currentStatus = 'preparing' }) {
  const currentIndex = STAGES.findIndex((stage) => stage.id === currentStatus);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Live Tracking</h3>
          <p className="text-sm text-slate-400">Order ID: #ORD-98421</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
          Live Updates
        </span>
      </div>

      {/* Progress Bar & Icons */}
      <div className="relative">
        {/* Background Connecting Track */}
        <div className="hidden md:block absolute top-5 left-6 right-6 h-1 bg-slate-800 -z-0" />

        {/* Active Progress Fill */}
        <div
          className="hidden md:block absolute top-5 left-6 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-in-out -z-0"
          style={{
            width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 90}%`,
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center">
                {/* Step Circle Indicator */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                </div>

                {/* Step Labels */}
                <div>
                  <p
                    className={`text-sm font-semibold tracking-wide ${
                      isCurrent ? 'text-blue-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}