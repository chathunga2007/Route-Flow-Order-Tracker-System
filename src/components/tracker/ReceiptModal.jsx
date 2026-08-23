import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, CheckCircle2, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../../store/orderStore';

export default function ReceiptModal({ isOpen, onClose, order }) {
  const [mounted, setMounted] = useState(false);
  const isDark = useOrderStore((state) => state.isDark);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !order || !mounted) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col transition-colors duration-200 ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10'
          }`}
        >
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Digital Order Receipt</h3>
            </div>
            <button 
              type="button"
              onClick={onClose} 
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ticket Content */}
          <div className={`p-6 space-y-5 overflow-y-auto flex-1 ${
            isDark ? 'bg-slate-950/70' : 'bg-white'
          }`}>
            <div className="text-center space-y-1.5">
              <div className={`inline-flex p-2.5 rounded-full mb-1 ${
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                RouteFlow Kitchen
              </h4>
              <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Order ID: #{order.id}
              </p>
              <div className="pt-1">
                <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] uppercase font-semibold border ${
                  isDark 
                    ? 'bg-slate-800 text-emerald-400 border-slate-700' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Customer & Courier Details */}
            <div className={`border-t border-b border-dashed py-3.5 space-y-2 text-xs ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <div className="flex justify-between items-center">
                <span>Customer</span>
                <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {order.customer}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span>Delivery Address</span>
                <span className={`font-medium text-right line-clamp-2 max-w-[220px] ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {order.address}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Assigned Courier</span>
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {order.driver?.name}
                </span>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-2.5">
              <p className={`text-[11px] uppercase font-bold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Ordered Items
              </p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <span className="font-semibold text-blue-500 mr-1.5">{item.qty}x</span>
                      {item.name}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Row */}
            <div className={`border-t pt-3.5 flex justify-between items-center text-sm font-bold ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Total (Cash On Delivery):</span>
              <span className={`text-lg font-black ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                {order.total}
              </span>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className={`p-4 border-t flex gap-3 shrink-0 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}