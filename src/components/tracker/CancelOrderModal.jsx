import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';

export default function CancelOrderModal({ isOpen, onClose, order }) {
  const [reason, setReason] = useState('Changed my mind');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !order || !mounted) return null;

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'cancelled',
        cancellationReason: reason,
      });
      setIsProcessing(false);
      setIsRefunded(true);
      toast.success(`Order #${order.id} Cancelled`, {
        description: `Full refund of ${order.total} has been initiated to original payment.`,
      });
      setTimeout(() => {
        setIsRefunded(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel order: ' + err.message);
      setIsProcessing(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white my-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Cancel Order #{order.id}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isRefunded ? (
            <div className="p-8 text-center space-y-3 bg-slate-950/70">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Order Cancelled & Refunded</h4>
              <p className="text-xs text-slate-400">
                100% refund of <span className="text-emerald-400 font-bold">{order.total}</span> credited.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4 bg-slate-950/70">
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to cancel this order? If cooking hasn't completed, you are eligible for an instant 100% refund.
              </p>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 block mb-1.5">
                  Select Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option>Changed my mind</option>
                  <option>Delivery time is too long</option>
                  <option>Ordered incorrect food items</option>
                  <option>Delivery address was mistaken</option>
                </select>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-400">Refund Amount:</span>
                <span className="text-emerald-400 font-bold text-sm">{order.total}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isProcessing ? 'Processing Refund...' : 'Confirm Cancellation'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Keep Order
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}