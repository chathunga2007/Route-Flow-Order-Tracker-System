import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Gauge, Zap, Compass, AlertCircle, Volume2, VolumeX, CheckCircle, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '../../store/orderStore';
import confetti from 'canvas-confetti';

export default function DriverCockpitModal({ isOpen, onClose, order }) {
  const [speed, setSpeed] = useState(38);
  const [distance, setDistance] = useState(2400); // 2.4km in meters
  const [nitro, setNitro] = useState(100);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { updateOrderStatus, isDark } = useOrderStore();
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Web Audio Dynamic Engine RPM Pitch Synthesizer
  useEffect(() => {
    if (!isOpen || audioMuted) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
    } catch (e) {
      console.warn(e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [isOpen, audioMuted]);

  // Adjust RPM frequency based on speed
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      const targetFreq = 70 + speed * 2.2;
      oscRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.1);
    }
  }, [speed]);

  // Telemetry Tick Simulation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDistance((prev) => {
        const step = isNitroActive ? 35 : 15;
        if (prev - step <= 0) {
          clearInterval(interval);
          handleFinishDelivery();
          return 0;
        }
        return prev - step;
      });

      if (isNitroActive) {
        setNitro((prev) => Math.max(0, prev - 3));
        setSpeed((prev) => Math.min(88, prev + 2));
      } else {
        setNitro((prev) => Math.min(100, prev + 1));
        setSpeed(Math.floor(36 + Math.random() * 8));
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen, isNitroActive]);

  // 3D Perspective Infinite Grid Animation
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const horizon = height * 0.45;

      // Night / Dark Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, isDark ? '#020617' : '#0f172a');
      skyGrad.addColorStop(1, isDark ? '#0f172a' : '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizon);

      // Road Surface
      const roadGrad = ctx.createLinearGradient(0, horizon, 0, height);
      roadGrad.addColorStop(0, '#0f172a');
      roadGrad.addColorStop(1, '#020617');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, horizon, width, height - horizon);

      // Perspective Road Boundaries
      ctx.strokeStyle = isNitroActive ? '#3b82f6' : '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.42, horizon);
      ctx.lineTo(width * 0.05, height);
      ctx.moveTo(width * 0.58, horizon);
      ctx.lineTo(width * 0.95, height);
      ctx.stroke();

      // Moving Center Dashed Lines (Speed Dependent)
      offset += (speed * 0.15);
      if (offset > 40) offset = 0;

      ctx.strokeStyle = isNitroActive ? '#60a5fa' : '#fbbf24';
      ctx.lineWidth = 4;
      for (let y = horizon; y < height; y += 30) {
        const adjustedY = y + (offset % 30);
        if (adjustedY >= height) continue;
        const progress = (adjustedY - horizon) / (height - horizon);
        const dashWidth = 4 + progress * 24;
        
        ctx.beginPath();
        ctx.moveTo(width * 0.5 - dashWidth / 2, adjustedY);
        ctx.lineTo(width * 0.5 + dashWidth / 2, adjustedY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, speed, isNitroActive, isDark]);

  const handleFinishDelivery = async () => {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    if (order?.id) {
      await updateOrderStatus(order.id, 'delivered');
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-950 border-2 border-blue-500/40 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col relative text-white"
        >
          {/* Top HUD Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm tracking-wider uppercase text-white">Driver Cockpit POV</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    LIVE TELEMETRY
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {order?.driver?.name} • {order?.driver?.vehicle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAudioMuted(!audioMuted)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
                title="Toggle RPM Audio"
              >
                {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3D Simulation Viewport */}
          <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-black flex items-center justify-center">
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-cover" />

            {/* Courier 3D Center Cockpit Bike Icon */}
            <div className="absolute bottom-6 flex flex-col items-center pointer-events-none z-10">
              {isNitroActive && (
                <div className="w-12 h-16 bg-blue-500/30 blur-md rounded-full animate-pulse mb--4" />
              )}
              <div className={`text-5xl sm:text-6xl filter drop-shadow-[0_15px_15px_rgba(59,130,246,0.6)] ${
                isNitroActive ? 'scale-110' : ''
              } transition-transform`}>
                🛵
              </div>
            </div>

            {/* In-Cockpit HUD Telemetry Gauges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-3 rounded-2xl flex items-center gap-3">
                <Gauge className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current Velocity</p>
                  <p className="text-xl font-mono font-black text-white">{speed} <span className="text-xs font-normal text-slate-400">km/h</span></p>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-3 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Remaining Route</p>
                  <p className="text-lg font-mono font-bold text-emerald-400">
                    {(distance / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Traffic Alert */}
            <div className="absolute top-4 right-4 z-10 max-w-[210px] hidden sm:block">
              <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 p-3 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" /> Traffic Condition
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Clear expressway along Marine Drive. ETA optimal.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Cockpit Controls */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            {/* Nitro Meter */}
            <div className="w-full sm:w-1/3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Zap className="w-3.5 h-3.5" /> Nitro Boost Reserve
                </span>
                <span className="font-mono text-white">{nitro}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-200"
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onMouseDown={() => nitro > 10 && setIsNitroActive(true)}
                onMouseUp={() => setIsNitroActive(false)}
                onTouchStart={() => nitro > 10 && setIsNitroActive(true)}
                onTouchEnd={() => setIsNitroActive(false)}
                disabled={nitro <= 10}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 active:scale-95 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" /> Hold for Nitro (Boost)
              </button>

              <button
                type="button"
                onClick={handleFinishDelivery}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Instant Deliver
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}