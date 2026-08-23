# 🚀 RouteFlow — Enterprise Live Delivery & Telematics Platform

<div align="center">

![RouteFlow Banner](https://img.shields.io/badge/RouteFlow-Enterprise%20Order%20Tracker-blue?style=for-the-badge&logo=compass&logoColor=white)

[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore%2012-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand%205-brown?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>A real-time, multi-role delivery logistics ecosystem featuring live GPS telematics, AI neural voice copilot, interactive 3D driver cockpit POV, and instant Firebase synchronization.</b>
</p>

[Key Features](#-key-features) •
[System Architecture](#-system-architecture) •
[3-in-1 Role Portals](#-3-in-1-role-portals) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[Environment Variables](#-environment-variables) •
[Author](#-author)

</div>

---

## 🌟 Overview

**RouteFlow** is a modern, enterprise-grade delivery tracking and telematics platform built for fast-paced logistics and food-tech operations. It bridges customers, kitchen dispatchers, and couriers in real-time through WebSocket-like reactive state synchronization powered by Firebase Cloud Firestore and Zustand.

---

## ✨ Key Features

### 📍 1. Real-Time Geospatial Tracking & Telematics
- **Interactive Leaflet & OpenStreetMap Live Map**: Dynamic tracking of courier movement along optimized route coordinates.
- **Live Device GPS Telematics Streaming**: Couriers can broadcast hardware GPS coordinates directly via the HTML5 Geolocation API (`watchPosition`) straight into Firestore.
- **Dynamic Speed & Distance HUD**: Real-time velocity gauge (`km/h`), remaining distance, and ambient weather telemetry.
- **Live Milestone Stepper**: Animated stage progression (`Placed` ➔ `Cooking` ➔ `Ready` ➔ `On Route` ➔ `Delivered`) with dynamic ETA countdown timer.

### 🎙️ 2. AI Copilot Orb (Neural Vox)
- **Hands-Free Voice Recognition**: Integrated Web Speech Recognition API (`webkitSpeechRecognition`) for natural speech-to-command interpretation.
- **Speech Synthesis Response (TTS)**: Instant voice replies via `speechSynthesis` informing users of status, driver details, and actions.
- **Smart Voice Commands**:
  - *"Where is my order?"* — Fetches live status and remaining ETA.
  - *"Who is my driver?"* — Provides courier name, vehicle, and rating.
  - *"Switch to dark mode / light mode"* — Dynamically triggers UI theme.
  - *"Advance order stage"* — Dispatches milestone updates automatically.

### 🚀 3. Interactive Driver Cockpit POV (3D Simulation)
- **First-Person 3D Canvas Viewport**: Simulated perspective road rendering with dynamic speed lines and horizon shading.
- **Dynamic Web Audio RPM Pitch Synthesizer**: Procedurally generates realistic engine throttle sound frequencies using `AudioContext` and sawtooth oscillator synced with velocity.
- **Nitro Boost Reserve Mechanism**: Interactive boost button allowing drivers to accelerate velocity up to 88 km/h.
- **Instant Milestone Completion**: Confetti celebration trigger on delivery completion.

### 📊 4. Vendor Kitchen Dispatch Hub & Analytics
- **Dual View Modes**: Switch seamlessly between a 5-stage **Kanban Board** and a high-density **Table List**.
- **Financial & Operations Telemetry**: Real-time metrics tracking Gross Revenue, Active Kitchen Tickets, Delivered Orders, and Average Dispatch Time.
- **Recharts Revenue Analytics**: Interactive hourly sales and order flow area chart.
- **Audio Chime System**: Web Audio sound chimes when new orders arrive or when stage updates occur.

### 🛵 5. Courier Delivery Portal
- **Hardware GPS Broadcast HUD**: One-touch toggle to stream real-time phone GPS to customer live maps.
- **Google Maps Integration**: Instant route launching in external Google Maps navigation.
- **Action Milestone Buttons**: Rapid progress reporting from restaurant pickup to doorstep handover.

### 📝 6. Smart Ordering & Customer Tools
- **Live Sri Lanka Geocode Autocomplete**: Real-time address querying powered by OpenStreetMap Nominatim API.
- **Interactive Cart & Menu**: Fast order placement with optimistic UI feedback.
- **Digital Receipt Generator**: Print-ready and downloadable breakdown of items, subtotal, and tax.
- **Driver Rating & Tipping**: Post-delivery courier rating and tip allocation system.
- **Midnight Dark / Crisp Light UI**: High-contrast, tailored glassmorphism design with Framer Motion transitions.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 + Vite)"]
        UI[Tailwind CSS v4 & Framer Motion UI]
        ZStore[Zustand Store (orderStore.js)]
        AudioEngine[Web Audio RPM & Chime Engine]
        AIVox[AI Speech Recognition & Synthesis]
        LeafletMap[Leaflet & OpenStreetMap Live Map]
    end

    subgraph Portals ["3-in-1 Role Portals"]
        Customer[Customer Live Tracker & Cockpit POV]
        Vendor[Kitchen Kanban & Recharts Analytics]
        Driver[Courier Telematics & GPS Broadcaster]
    end

    subgraph Backend ["Cloud Infrastructure"]
        Firestore[(Firebase Cloud Firestore)]
        Nominatim[OSM Nominatim Geocoding API]
        GMaps[Google Maps External Routing]
    end

    Customer --> ZStore
    Vendor --> ZStore
    Driver --> ZStore

    ZStore <-->|Real-time onSnapshot Listeners| Firestore
    Driver -->|Hardware GPS watchPosition| Firestore
    Customer -->|Live Address Search| Nominatim
    Driver -->|External Nav Route| GMaps
    ZStore --> AudioEngine
    Customer --> AIVox
    Customer --> LeafletMap
```

---

## 👥 3-in-1 Role Portals

| Role Portal | Core Capabilities |
|---|---|
| **🧭 Customer Tracker** | Live GPS map, ETA timer, 3D Cockpit POV mode, digital receipt, courier calling & ratings |
| **🍳 Vendor Hub** | Kanban & List dispatch board, hourly revenue charts, audio bell notifications, order management |
| **🛵 Courier Portal** | Live GPS broadcasting, Google Maps turn-by-turn routing, instant milestone updates, cash collection |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | `^19.2.8` | Core Component-driven UI framework |
| **Vite** | `^8.2.0` | Ultra-fast development server & bundler |
| **Tailwind CSS** | `^4.3.3` | Modern utility-first styling with Glassmorphism |
| **Firebase Firestore** | `^12.18.0` | Real-time NoSQL database with offline persistence |
| **Zustand** | `^5.0.15` | Fast, lightweight global state management |
| **Leaflet / React-Leaflet** | `^1.9.4 / ^5.0.0` | Interactive mapping & route polyline rendering |
| **Recharts** | `^3.10.1` | Financial telemetry & hourly revenue visualization |
| **Framer Motion** | `^13.1.1` | Smooth spring micro-interactions & modal transitions |
| **Web Audio API** | *Native* | Dynamic engine sound generation & notification chimes |
| **Web Speech API** | *Native* | Voice command recognition & AI speech synthesis |
| **Sonner** | `^2.0.8` | Rich, animated toast notifications |
| **Canvas Confetti** | `^1.9.4` | Delightful milestone completion animations |

---

## 📁 Project Directory Structure

```
routeflow-order-tracker/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Icons & branding assets
│   ├── components/
│   │   ├── common/
│   │   │   ├── AICopilotOrb.jsx       # Voice recognition & AI assistant
│   │   │   └── CreateOrderModal.jsx   # Live geocoding order creation
│   │   ├── driver/
│   │   │   └── DriverPortal.jsx       # Courier telematics & GPS streamer
│   │   ├── tracker/
│   │   │   ├── CancelOrderModal.jsx   # Order cancellation & refund modal
│   │   │   ├── DeliveryCard.jsx       # Driver profile & item summary
│   │   │   ├── DriverActionModal.jsx  # Chat & quick communication modal
│   │   │   ├── DriverCockpitModal.jsx # 3D simulation POV with audio synth
│   │   │   ├── DriverRatingModal.jsx  # Courier review & tip modal
│   │   │   ├── LiveMap.jsx            # Interactive Leaflet live tracking map
│   │   │   ├── OrderStepper.jsx       # 5-stage progress indicator with ETA
│   │   │   └── ReceiptModal.jsx       # Digital printable receipt
│   │   └── vendor/
│   │       ├── VendorAnalytics.jsx    # Recharts metrics & telemetry
│   │       └── VendorDashboard.jsx    # Kanban & Table kitchen dispatch hub
│   ├── store/
│   │   └── orderStore.js       # Zustand global state & Firestore listeners
│   ├── utils/
│   │   ├── audio.js            # Web Audio chime synthesis & FX
│   │   └── fleet.js            # Courier fleet generator & mock data
│   ├── firebase.js             # Firebase SDK initialization & offline cache
│   ├── App.jsx                 # Main layout & multi-role view controller
│   ├── index.css               # Design system tokens & Tailwind imports
│   └── main.jsx                # React root entrypoint
├── .env.example                # Sample environment configuration
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # Tailwind styling configuration
├── vite.config.js              # Vite bundler plugins & settings
└── vercel.json                 # Production deployment configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** `>= 18.0.0`
- **npm** or **yarn** / **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Route-Flow-Order-Tracker-System.git
cd Route-Flow-Order-Tracker-System/routeflow-order-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase Configuration
Create a `.env.local` file in the root of `routeflow-order-tracker/` and supply your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** Firestore requires an `orders` collection. The application automatically initializes and listens to updates on this collection. You can also click the **`+ Demo`** button in the top toolbar to seed mock data instantly.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain |
| `VITE_FIREBASE_PROJECT_ID` | Google Cloud / Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase Web Application ID |

---

## 👨‍💻 Author

<div align="center">

### Developed with ❤️ by **Chathunga Bimsara**

*Crafting modern, high-performance web experiences and intelligent real-time applications.*

---

© 2026 **RouteFlow Logistics Inc.** All rights reserved.
</div>
