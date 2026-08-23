import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, CheckCircle2, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiptModal({ isOpen, onClose, order }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !order || !mounted) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white relative max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">Digital Order Receipt</h3>
            </div>
            <button 
              type="button"
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ticket Content */}
          <div className="p-6 space-y-5 bg-slate-950/70 overflow-y-auto flex-1">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2.5 bg-emerald-500/10 text-emerald-400 rounded-full mb-1">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black tracking-tight text-white">RouteFlow Kitchen</h4>
              <p className="text-xs font-mono text-slate-400">Order ID: #{order.id}</p>
              <div className="pt-1">
                <span className="inline-block px-3 py-0.5 rounded-full bg-slate-800 text-[11px] text-emerald-400 border border-slate-700 uppercase font-semibold">
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-800 py-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Customer</span>
                <span className="text-slate-200 font-semibold">{order.customer}</span>
              </div>
              <div className="flex justify-between items-start text-slate-400 gap-4">
                <span>Delivery Address</span>
                <span className="text-slate-200 font-medium text-right line-clamp-2 max-w-[220px]">{order.address}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Assigned Courier</span>
                <span className="text-slate-200 font-medium">{order.driver?.name}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Ordered Items</p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">
                      <span className="font-semibold text-blue-400 mr-1.5">{item.qty}x</span>
                      {item.name}
                    </span>
                    <span className="font-semibold text-white">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3.5 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-300">Total (Cash On Delivery):</span>
              <span className="text-emerald-400 text-lg font-black">{order.total}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
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