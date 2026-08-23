import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Map Marker Icons using SVGs
const createCustomIcon = (bgColor, iconSvg) =>
  L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${bgColor};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5);
    ">${iconSvg}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const restaurantIcon = createCustomIcon(
  '#f59e0b',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>'
);

const customerIcon = createCustomIcon(
  '#10b981',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
);

const driverIcon = createCustomIcon(
  '#3b82f6',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="18.5" cy="17.5" r="3.5"></circle><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="15" cy="5" r="1"></circle><path d="M12 17.5V14l-3-3 4-3 2 3h2"></path></svg>'
);

// Route waypoint coordinates (Restaurant -> Customer)
const ROUTE_COORDINATES = [
  [6.9271, 79.8612], // Restaurant (Colombo 01)
  [6.9185, 79.8590],
  [6.9100, 79.8550],
  [6.9020, 79.8540],
  [6.8950, 79.8555], // Customer (Colombo 03)
];

export default function LiveMap() {
  const [driverPosition, setDriverPosition] = useState(ROUTE_COORDINATES[1]);
  const [stepIndex, setStepIndex] = useState(1);

  // Simulate live driver movement along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = (prev + 1) % ROUTE_COORDINATES.length;
        setDriverPosition(ROUTE_COORDINATES[next]);
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
      <MapContainer
        center={[6.912, 79.857]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        {/* Dark Mode CartoDB Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Planned Route Line */}
        <Polyline
          positions={ROUTE_COORDINATES}
          pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '6, 8', opacity: 0.8 }}
        />

        {/* Restaurant Point */}
        <Marker position={ROUTE_COORDINATES[0]} icon={restaurantIcon}>
          <Popup className="text-slate-900 font-semibold">Burger Hub Kitchen</Popup>
        </Marker>

        {/* Live Courier Point */}
        <Marker position={driverPosition} icon={driverIcon}>
          <Popup className="text-slate-900 font-semibold">Courier Kasun (Live)</Popup>
        </Marker>

        {/* Customer Point */}
        <Marker position={ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1]} icon={customerIcon}>
          <Popup className="text-slate-900 font-semibold">Your Delivery Location</Popup>
        </Marker>
      </MapContainer>

      {/* Floating Status Tag */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        Live GPS Tracking
      </div>
    </div>
  );
}