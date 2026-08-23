import React, { useState, useEffect } from 'react';
import { Check, Clock, Utensils, Bike, CheckCircle2, Receipt, Star, XCircle } from 'lucide-react';
import ReceiptModal from './ReceiptModal';
import DriverRatingModal from './DriverRatingModal';
import CancelOrderModal from './CancelOrderModal';
import { useOrderStore } from '../../store/orderStore';

const STEPS = [
  { id: 'placed', label: 'Placed', icon: Clock, desc: 'Order received' },
  { id: 'preparing', label: 'Cooking', icon: Utensils, desc: 'Kitchen active' },
  { id: 'ready', label: 'Ready', icon: Check, desc: 'Driver arriving' },
  { id: 'out_for_delivery', label: 'On Route', icon: Bike, desc: 'En route' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Completed' },
];

export default function OrderStepper({ currentStatus = 'placed' }) {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1320);
  const { orders, activeOrderId, isDark } = useOrderStore();
  const currentOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const currentIdx = STEPS.findIndex((s) => s.id === currentStatus);
  const canCancel = currentStatus === 'placed' || currentStatus === 'preparing';

  useEffect(() => {
    if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
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
    <div className={`border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 transition-colors duration-200 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      {/* Top Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Tracking</h3>
            <span className={`font-mono text-[11px] sm:text-xs border px-2.5 py-0.5 rounded-lg ${
              isDark ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-600 bg-blue-50 border-blue-200'
            }`}>
              #{currentOrder?.id || 'ORD-LIVE'}
            </span>
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time status synced with kitchen
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {currentStatus === 'cancelled' ? (
            <span className={`text-xs font-bold border px-3 py-1 rounded-xl ${
              isDark ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-red-600 bg-red-50 border-red-200'
            }`}>
              Order Cancelled (Refunded)
            </span>
          ) : currentStatus !== 'delivered' ? (
            <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-xl ${
              isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[11px] sm:text-xs font-mono font-bold">
                ETA: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsRatingOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-1 border rounded-xl text-xs font-bold transition cursor-pointer ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Rate
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-1 border rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDark 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsReceiptOpen(true)}
            className={`flex items-center gap-1 px-2.5 py-1 border rounded-xl text-xs font-semibold transition cursor-pointer ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-500" /> Receipt
          </button>
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-4">
        {STEPS.map((step, idx) => {
          const isDone = currentStatus !== 'cancelled' && idx <= currentIdx;
          const isCurrent = currentStatus !== 'cancelled' && idx === currentIdx;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  currentStatus === 'cancelled'
                    ? (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400')
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-2 sm:ring-4 ring-blue-500/20 shadow-md scale-105'
                    : isDone
                    ? 'bg-emerald-500 text-white font-bold'
                    : (isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-200')
                }`}
              >
                <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              <div className="mt-1.5">
                <p className={`text-[10px] sm:text-xs font-bold truncate ${
                  isDone 
                    ? (isDark ? 'text-white' : 'text-slate-900') 
                    : (isDark ? 'text-slate-500' : 'text-slate-400')
                }`}>
                  {step.label}
                </p>
                <p className={`text-[9px] hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ReceiptModal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} order={currentOrder} />
      <DriverRatingModal isOpen={isRatingOpen} onClose={() => setIsRatingOpen(false)} order={currentOrder} />
      <CancelOrderModal isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)} order={currentOrder} />
    </div>
  );
}