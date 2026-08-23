import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { Navigation, Phone, CheckCircle, MapPin, Radio, ShieldCheck, ExternalLink, Zap } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';

export default function DriverPortal() {
  const { orders, updateOrderStatus, activeOrderId, setActiveOrder, isDark } = useOrderStore();
  const [isSharingGps, setIsSharingGps] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders.find((o) => o.status !== 'delivered');

  // Real-time Device GPS Watcher
  useEffect(() => {
    let watchId = null;

    if (isSharingGps && activeOrder) {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser.');
        setIsSharingGps(false);
        return;
      }

      toast.success('Live GPS Broadcast Active', {
        description: 'Transmitting device coordinates to customer live map.',
      });

      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoords({ latitude, longitude });

          try {
            const orderRef = doc(db, 'orders', activeOrder.id);
            await updateDoc(orderRef, {
              'driver.currentLocation': { lat: latitude, lng: longitude },
              lastGpsPing: new Date().toISOString(),
            });
          } catch (err) {
            console.error('GPS broadcast error:', err);
          }
        },
        (err) => {
          console.error(err);
          toast.error('Failed to get precise GPS location: ' + err.message);
          setIsSharingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharingGps, activeOrder]);

  const openGoogleMapsRoute = () => {
    if (!activeOrder?.address) return;
    const dest = encodeURIComponent(activeOrder.address + ', Sri Lanka');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  if (!activeOrder) {
    return (
      <div className={`p-12 text-center border rounded-2xl space-y-3 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <p className="text-slate-400 text-sm">No active delivery assignments found right now.</p>
        <span className="text-xs text-emerald-500 font-semibold">Courier status: Online & Ready for dispatch</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Driver Online Control HUD */}
      <div className={`p-5 border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
            <Radio className={`w-6 h-6 ${isSharingGps ? 'animate-pulse text-emerald-500' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Courier Telematics Broadcast</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isSharingGps 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isSharingGps ? 'GPS STREAMING' : 'OFFLINE'}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentCoords 
                ? `Transmitting: Lat ${currentCoords.latitude.toFixed(4)}, Lng ${currentCoords.longitude.toFixed(4)}`
                : 'Turn on GPS to beam real location to customer tracker'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSharingGps(!isSharingGps)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
            isSharingGps
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
          }`}
        >
          {isSharingGps ? 'Stop GPS Broadcast' : 'Start Live GPS Shift'}
        </button>
      </div>

      {/* Active Job Assignment Card */}
      <div className={`p-6 border rounded-2xl shadow-sm space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Current Job Ticket</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Order #{activeOrder.id}</h4>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold">
                {activeOrder.total} COD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openGoogleMapsRoute}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate via Google Maps <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 border rounded-xl space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-400">Customer</span>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeOrder.customer}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> {activeOrder.address}
            </p>
          </div>

          <div className={`p-4 border rounded-xl space-y-1.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-400">Parcel Summary</span>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {activeOrder.items?.map((i) => `${i.qty}x ${i.name}`).join(', ')}
            </p>
            <span className="text-[11px] text-emerald-500 font-semibold block">Collect cash on arrival: {activeOrder.total}</span>
          </div>
        </div>

        {/* Courier Stage Flow Actions */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase text-slate-400 block">Update Delivery Milestone</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={activeOrder.status === 'ready' || activeOrder.status === 'out_for_delivery' || activeOrder.status === 'delivered'}
              onClick={() => updateOrderStatus(activeOrder.id, 'ready')}
              className="py-3 px-4 bg-purple-600/20 hover:bg-purple-600 disabled:opacity-40 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              1. Arrived at Restaurant
            </button>

            <button
              type="button"
              disabled={activeOrder.status === 'out_for_delivery' || activeOrder.status === 'delivered'}
              onClick={() => updateOrderStatus(activeOrder.id, 'out_for_delivery')}
              className="py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> 2. Picked Up & Start Ride
            </button>

            <button
              type="button"
              disabled={activeOrder.status === 'delivered'}
              onClick={() => updateOrderStatus(activeOrder.id, 'delivered')}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> 3. Mark as Handed Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}