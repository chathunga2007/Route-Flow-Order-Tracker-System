import React, { useState } from 'react';
import { X, Phone, PhoneOff, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverActionModal({ isOpen, onClose, driver, type = 'chat' }) {
  const [messages, setMessages] = useState([
    { sender: 'driver', text: 'Hello! I have picked up your order and I am on my way.' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isCalling, setIsCalling] = useState(true);

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [...prev, { sender: 'me', text: inputMsg.trim() }]);
    setInputMsg('');

    // Simulate instant automated driver reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'driver', text: 'Got it, see you in a few minutes!' },
      ]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
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
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Call Mode */}
          {type === 'call' ? (
            <div className="p-8 text-center space-y-6">
              <div className="relative flex items-center justify-center">
                {isCalling && (
                  <span className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping" />
                )}
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-white z-10">
                  <User className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{driver?.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{driver?.phone}</p>
                <p className="text-xs text-emerald-400 font-semibold mt-2 animate-pulse">
                  {isCalling ? 'Connecting Cellular Call...' : 'Call Ended'}
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                {isCalling ? (
                  <button
                    onClick={() => setIsCalling(false)}
                    className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCalling(true)}
                    className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg transition"
                  >
                    <Phone className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Chat Mode */
            <div className="flex flex-col h-[380px]">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs ${
                        m.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to courier..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}