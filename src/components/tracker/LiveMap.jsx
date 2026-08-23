import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOrderStore } from '../../store/orderStore';
import confetti from 'canvas-confetti';
import { Gauge, Navigation, Sun } from 'lucide-react';

const RESTAURANT_POS = [6.9271, 79.8612];
const CUSTOMER_POS = [6.8850, 79.8580];

const ROUTE_PATH = [
  [6.9271, 79.8612],
  [6.9180, 79.8590],
  [6.9080, 79.8560],
  [6.8970, 79.8550],
  [6.8850, 79.8580],
];

const restaurantIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 shadow-lg flex items-center justify-center text-white text-xs font-bold ring-4 ring-amber-500/20">🍔</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const customerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-lg flex items-center justify-center text-white text-xs font-bold ring-4 ring-emerald-500/20">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const driverIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <span class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></span>
      <div class="w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-sm font-bold z-10">
        🛵
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapViewController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function LiveMap() {
  const { orders, activeOrderId } = useOrderStore();
  const currentOrder = orders.find((o) => o.id === activeOrderId) || orders[0];
  const status = currentOrder?.status || 'placed';

  const [driverPos, setDriverPos] = useState(RESTAURANT_POS);
  const [speed, setSpeed] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState('2.4 km');

  useEffect(() => {
    if (status === 'delivered') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setDriverPos(CUSTOMER_POS);
      setSpeed(0);
      setDistanceRemaining('0.0 km');
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'out_for_delivery') {
      setDriverPos(status === 'delivered' ? CUSTOMER_POS : RESTAURANT_POS);
      setSpeed(0);
      setDistanceRemaining(status === 'delivered' ? '0.0 km' : '2.4 km');
      return;
    }

    let step = 0;
    const totalSteps = ROUTE_PATH.length;
    const distances = ['2.1 km', '1.6 km', '0.9 km', '0.4 km', 'Arriving'];
    
    setSpeed(36);

    const interval = setInterval(() => {
      step = (step + 1) % totalSteps;
      setDriverPos(ROUTE_PATH[step]);
      setDistanceRemaining(distances[step]);
      setSpeed(Math.floor(32 + Math.random() * 12)); // Dynamic speed fluctuations
    }, 2800);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Top Right Live Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[400] flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-200 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline">Live GPS:</span> {status === 'out_for_delivery' ? 'Driver En Route' : 'Stationary'}
      </div>

      {/* Driver Telemetry HUD Badge */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl text-[11px] font-mono text-slate-300 shadow-xl">
        <div className="flex items-center gap-1 text-blue-400">
          <Gauge className="w-3.5 h-3.5" />
          <span>{speed} km/h</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1 text-emerald-400">
          <Navigation className="w-3.5 h-3.5" />
          <span>{distanceRemaining}</span>
        </div>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1 text-amber-400">
          <Sun className="w-3.5 h-3.5" />
          <span>29°C</span>
        </div>
      </div>

      <MapContainer
        center={driverPos}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapViewController center={driverPos} />

        <Marker position={RESTAURANT_POS} icon={restaurantIcon}>
          <Popup className="text-slate-900 font-sans">
            <strong>Burger Lab HQ</strong> <br /> Order Kitchen
          </Popup>
        </Marker>

        <Marker position={CUSTOMER_POS} icon={customerIcon}>
          <Popup className="text-slate-900 font-sans">
            <strong>Delivery Destination</strong> <br /> {currentOrder?.address || 'Customer Location'}
          </Popup>
        </Marker>

        <Marker position={driverPos} icon={driverIcon}>
          <Popup className="text-slate-900 font-sans">
            <strong>{currentOrder?.driver?.name || 'Driver'}</strong> <br />
            {status === 'out_for_delivery' ? 'On the way with your meal' : 'Awaiting dispatch'}
          </Popup>
        </Marker>

        <Polyline
          positions={ROUTE_PATH}
          pathOptions={{
            color: '#3b82f6',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.8,
          }}
        />
      </MapContainer>
    </div>
  );
}