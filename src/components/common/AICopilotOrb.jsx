import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, Sparkles, X, Volume2, Bot, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../../store/orderStore';
import { toast } from 'sonner';

export default function AICopilotOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('How can I assist your delivery flow today?');
  const [mounted, setMounted] = useState(false);

  const { orders, activeOrderId, updateOrderStatus, isDark, toggleTheme } = useOrderStore();
  const recognitionRef = useRef(null);
  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  useEffect(() => {
    setMounted(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.error('Speech error:', e);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        processVoiceCommand(spokenText);
      };

      recognitionRef.current = recognition;
    }
  }, [orders, activeOrderId, isDark]);

  // Voice Synthesizer (Text-to-Speech)
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('Listening...');
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  // AI Command Processing Engine
  const processVoiceCommand = (cmd) => {
    const text = cmd.toLowerCase();

    if (text.includes('status') || text.includes('where is') || text.includes('track')) {
      if (activeOrder) {
        const reply = `Order ${activeOrder.id} is currently ${activeOrder.status.replace(/_/g, ' ')}. Estimated arrival is ${activeOrder.eta}.`;
        setAiResponse(reply);
        speakText(reply);
      } else {
        const reply = "No active orders found in the system.";
        setAiResponse(reply);
        speakText(reply);
      }
      return;
    }

    if (text.includes('dark mode') || text.includes('night mode')) {
      if (!isDark) toggleTheme();
      const reply = "Switched interface to Midnight Dark Mode.";
      setAiResponse(reply);
      speakText(reply);
      return;
    }

    if (text.includes('light mode') || text.includes('day mode')) {
      if (isDark) toggleTheme();
      const reply = "Switched interface to Crisp Light Mode.";
      setAiResponse(reply);
      speakText(reply);
      return;
    }

    if (text.includes('driver') || text.includes('courier')) {
      if (activeOrder?.driver) {
        const reply = `Your courier is ${activeOrder.driver.name}, driving a ${activeOrder.driver.vehicle} with a ${activeOrder.driver.rating} star rating.`;
        setAiResponse(reply);
        speakText(reply);
      }
      return;
    }

    if (text.includes('advance') || text.includes('next stage') || text.includes('ready')) {
      if (activeOrder) {
        const flow = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
        const currentIdx = flow.indexOf(activeOrder.status);
        const next = flow[currentIdx + 1];
        if (next) {
          updateOrderStatus(activeOrder.id, next);
          const reply = `Advancing order ${activeOrder.id} to ${next.replace(/_/g, ' ')}.`;
          setAiResponse(reply);
          speakText(reply);
        }
      }
      return;
    }

    const fallback = `Understood: "${cmd}". No exact automated action configured for this command yet.`;
    setAiResponse(fallback);
    speakText(fallback);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating Animated Copilot Trigger Orb */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-2xl shadow-blue-500/40 border border-white/20 flex items-center justify-center cursor-pointer"
        >
          <span className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-md group-hover:blur-lg animate-pulse" />
          <Sparkles className="w-6 h-6 relative z-10 animate-spin" style={{ animationDuration: '8s' }} />
        </motion.button>
      </div>

      {/* AI Copilot Interactive Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`border-2 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col ${
                isDark
                  ? 'bg-slate-950 border-blue-500/40 text-white'
                  : 'bg-white border-blue-500/30 text-slate-900'
              }`}
            >
              {/* Header */}
              <div className={`p-5 border-b flex items-center justify-between ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-cyan-400 text-white rounded-2xl shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base flex items-center gap-1.5">
                      RouteFlow AI Assistant
                      <span className="text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                        NEURAL VOX
                      </span>
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Voice-activated dispatch & tracking intelligence
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Voice Orb Interaction Center */}
              <div className="p-8 flex flex-col items-center text-center space-y-6">
                {/* Glowing Pulsating Orb */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`absolute w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${
                      isListening ? 'bg-cyan-500/60 scale-125 animate-ping' : 'bg-blue-600/30 scale-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xl cursor-pointer ${
                      isListening
                        ? 'bg-red-500 border-white text-white scale-110 shadow-red-500/50 animate-pulse'
                        : 'bg-gradient-to-tr from-blue-600 to-cyan-500 border-white/40 text-white hover:scale-105 shadow-blue-500/40'
                    }`}
                  >
                    {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                    {isListening ? 'Listening to your command...' : 'Tap Mic to Speak'}
                  </p>
                  {transcript && (
                    <p className={`text-sm font-mono italic px-4 py-1.5 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      "{transcript}"
                    </p>
                  )}
                </div>

                {/* AI Speech Bubble */}
                <div className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 shadow-inner ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <Volume2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">{aiResponse}</p>
                </div>

                {/* Example Quick Commands */}
                <div className="w-full pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-left flex items-center gap-1">
                    <Command className="w-3 h-3" /> Try Saying:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Where is my order?',
                      'Who is my driver?',
                      'Switch to dark mode',
                      'Switch to light mode',
                      'Advance order stage',
                    ].map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setTranscript(sample);
                          processVoiceCommand(sample);
                        }}
                        className={`text-[11px] px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 hover:border-blue-500 text-slate-300'
                            : 'bg-white border-slate-200 hover:border-blue-500 text-slate-700 shadow-sm'
                        }`}
                      >
                        🗣️ "{sample}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}