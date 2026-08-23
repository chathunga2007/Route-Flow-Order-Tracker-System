import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';

const TIP_OPTIONS = [100, 200, 500];

export default function DriverRatingModal({ isOpen, onClose, order }) {
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(200);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !order || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        rating: rating,
        tip: selectedTip,
        feedback: feedback,
      });
      toast.success('Thank you! Rating & Tip submitted.');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
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
              <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <h3 className="font-bold text-sm text-white">Rate Your Courier</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-950/70">
            <div className="text-center space-y-2">
              <img
                src={order.driver?.avatar}
                alt={order.driver?.name}
                className="w-16 h-16 rounded-full border-2 border-emerald-500/40 mx-auto object-cover"
              />
              <h4 className="font-bold text-base text-white">{order.driver?.name}</h4>
              <p className="text-xs text-slate-400">Delivered Order #{order.id}</p>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-600'
                      } transition`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> Add Courier Tip
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIP_OPTIONS.map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => setSelectedTip(tip)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      selectedTip === tip
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Rs. {tip}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <textarea
                rows={2}
                placeholder="Write a quick compliment (optional)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> {submitting ? 'Submitting...' : `Submit Rating & Tip (Rs. ${selectedTip})`}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}