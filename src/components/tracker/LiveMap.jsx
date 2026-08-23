import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOrderStore } from '../../store/orderStore';
import confetti from 'canvas-confetti';

// Coordinates (Colombo sample delivery route)
const RESTAURANT_POS = [6.9271, 79.8612]; // Colombo Fort
const CUSTOMER_POS = [6.8850, 79.8580];   // Colombo 03

const ROUTE_PATH = [
  [6.9271, 79.8612],
  [6.9180, 79.8590],
  [6.9080, 79.8560],
  [6.8970, 79.8550],
  [6.8850, 79.8580],
];

// Custom Pulsing Markers
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

  // Trigger celebration confetti when delivered
  useEffect(() => {
    if (status === 'delivered') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setDriverPos(CUSTOMER_POS);
    }
  }, [status]);

  // Smooth route interpolation for Out for Delivery status
  useEffect(() => {
    if (status !== 'out_for_delivery') {
      setDriverPos(status === 'delivered' ? CUSTOMER_POS : RESTAURANT_POS);
      return;
    }

    let step = 0;
    const totalSteps = ROUTE_PATH.length;
    const interval = setInterval(() => {
      step = (step + 1) % totalSteps;
      setDriverPos(ROUTE_PATH[step]);
    }, 2800);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Live GPS Tracking: {status === 'out_for_delivery' ? 'Driver En Route' : 'Stationary'}
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

        {/* Restaurant Point */}
        <Marker position={RESTAURANT_POS} icon={restaurantIcon}>
          <Popup className="text-slate-900 font-sans">
            <strong>Burger Lab HQ</strong> <br /> Order Kitchen
          </Popup>
        </Marker>

        {/* Customer Destination Point */}
        <Marker position={CUSTOMER_POS} icon={customerIcon}>
          <Popup className="text-slate-900 font-sans">
            <strong>Delivery Destination</strong> <br /> {currentOrder?.address || 'Customer Location'}
          </Popup>
        </Marker>

        {/* Dynamic Moving Driver */}
        <Marker position={driverPos} icon={driverIcon}>
          <Popup className="text-slate-900 font-sans">
            <strong>{currentOrder?.driver?.name || 'Driver'}</strong> <br />
            {status === 'out_for_delivery' ? 'On the way with your meal' : 'Awaiting dispatch'}
          </Popup>
        </Marker>

        {/* Route Line */}
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