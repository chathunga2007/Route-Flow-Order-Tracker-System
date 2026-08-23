import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, PhoneOff, Send, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverActionModal({ isOpen, onClose, driver, type = 'chat' }) {
  const [messages, setMessages] = useState([
    { sender: 'driver', text: 'Hello! I have picked up your order and I am on my way.' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isCalling, setIsCalling] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [...prev, { sender: 'me', text: inputMsg.trim() }]);
    setInputMsg('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'driver', text: 'Got it, see you in a few minutes!' },
      ]);
    }, 1200);
  };

  const rawPhone = (driver?.phone || '+94712345678').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=Hello%20${encodeURIComponent(driver?.name || 'Driver')},%20I%20am%20tracking%20my%20order%20on%20RouteFlow!`;

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
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={driver?.avatar}
                alt={driver?.name}
                className="w-10 h-10 rounded-full border border-slate-700 object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-white">{driver?.name}</h4>
                <p className="text-[11px] text-slate-400">{driver?.vehicle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {type === 'call' ? (
            <div className="p-8 text-center space-y-6 bg-slate-950/60">
              <div className="relative flex items-center justify-center">
                {isCalling && (
                  <span className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" />
                )}
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-white z-10 shadow-xl">
                  <User className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{driver?.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{driver?.phone || '+94 71 234 5678'}</p>
                <p className="text-xs text-emerald-400 font-semibold mt-2 animate-pulse">
                  {isCalling ? 'Connecting Cellular Call...' : 'Call Ended'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <a
                  href={`tel:${driver?.phone || '+94712345678'}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> Open Phone Dialer
                </a>
                <button
                  type="button"
                  onClick={() => setIsCalling(!isCalling)}
                  className={`p-3 rounded-xl transition cursor-pointer flex items-center justify-center ${
                    isCalling ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[400px] bg-slate-950/60">
              {/* WhatsApp Quick Action Banner */}
              <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-800/40 flex justify-between items-center text-xs">
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <MessageCircle className="w-3.5 h-3.5" /> Prefer WhatsApp?
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] transition"
                >
                  Chat on WhatsApp ↗
                </a>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs ${
                        m.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-900/90 shrink-0">
                <input
                  type="text"
                  placeholder="Type a message to courier..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}