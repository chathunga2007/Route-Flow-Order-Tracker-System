import React, { useState, useEffect } from 'react';
import { Check, Clock, Utensils, Bike, CheckCircle2, Receipt, Star } from 'lucide-react';
import ReceiptModal from './ReceiptModal';
import DriverRatingModal from './DriverRatingModal';
import { useOrderStore } from '../../store/orderStore';

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Clock, desc: 'Order received' },
  { id: 'preparing', label: 'Preparing', icon: Utensils, desc: 'Kitchen is cooking' },
  { id: 'ready', label: 'Ready for Pickup', icon: Check, desc: 'Driver is arriving' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'En route' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Completed safely' },
];

export default function OrderStepper({ currentStatus = 'placed' }) {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1320);
  const { orders, activeOrderId } = useOrderStore();
  const currentOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const currentIdx = STEPS.findIndex((s) => s.id === currentStatus);

  useEffect(() => {
    if (currentStatus === 'delivered') {
      setTimeLeft(0);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStatus]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white">Live Tracking</h3>
            <span className="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-lg">
              #{currentOrder?.id || 'ORD-LIVE'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time status synced with kitchen</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {currentStatus !== 'delivered' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-blue-400">
                ETA: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} mins
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsRatingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Rate Courier
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsReceiptOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" /> View Receipt
          </button>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="relative flex flex-col md:flex-row justify-between gap-4">
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex-1 flex md:flex-col items-center gap-3 text-left md:text-center relative">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 z-10 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg scale-110'
                    : isDone
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>

              <div>
                <p className={`text-xs font-bold ${isDone ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 hidden md:block">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={currentOrder}
      />

      <DriverRatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        order={currentOrder}
      />
    </div>
  );
}