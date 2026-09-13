# ⚡ EventPulse — Real-Time Summit Companion & Incident Triage System

EventPulse is a full-stack event companion and emergency response platform built for large-scale technology summits, conferences, and public venues. It features interactive 3D multi-level venue maps, real-time crowd congestion telemetry, emergency SOS dispatching, smart schedule seat reservations, and Gemini AI assistance.

---

## ✨ Key Capabilities

### 🗺️ 3D Architectural Venue Map & Wayfinding
- **2D / 3D Isometric View**: Toggle between a 2D blueprint map and a 3D architectural perspective view with counter-rotated 3D standing pins.
- **Multi-Floor Navigation**: Seamlessly switch between **Level 1** (Main Halls & Expo) and **Level 2** (Mezzanine, VIP Lounge, Speaker Green Room).
- **Turn-by-Turn Guidance**: Animated SVG route paths (`animate-map-dash`) guiding attendees to stages, restrooms, food, and help desks.
- **Step-Free Accessibility Mode**: Dedicated accessible path overlays verified for wheelchair and high-contrast navigation.

### 📡 Live Crowd Radar
- **Real-Time Congestion Telemetry**: Monitor capacity percentages across stages, dining courts, and entrances.
- **Clearance Notifications**: Opt-in to receive alerts when crowded stages or restrooms clear below 60% capacity.

### 🚨 Emergency SOS Dispatch & Incident Response
- **Hold-to-Dispatch SOS Beacons**: Attendees can broadcast high-priority medical, security, accessibility, or help alerts.
- **Organizer Command Console**: Centralized triage dashboard for event coordinators to acknowledge alerts, dispatch field units, and broadcast emergency alerts to all attendees.

### 📅 Smart Schedule & Seat Reservations
- **Interactive Itinerary**: Filter sessions by tracks (Tech, AI/ML, Design, Business, Workshops).
- **Seat Reservations & Reminders**: Lock in seats for high-demand keynotes and set calendar reminders.
- **Direct Event Actions**: Every event card features direct buttons for **Venue Map**, **Crowd Radar**, and **SOS**.

### 🤖 Gemini AI Summit Assistant
- Powered by `@google/genai` on `/api/ai/assistant` for natural language room guidance, session updates, and venue navigation assistance.

### 🔐 Authentication & Session Persistence
- **Sign In & Account Registration**: Full auth flow with role-based access (`Attendee` vs `Organizer`).
- **One-Click Demo Mode**: Instant single-tap evaluation as **Atharva (Organizer Coordinator)** or **Alex Rivera (Attendee)**.

### 🌐 Public Landing Page
- Modern showcase page with live telemetry ticker (`14,820+` Attendees, `99.98%` Mesh Sync), feature cards, and quick demo CTAs.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion
- **Backend API**: Node.js, Express (`server.ts`)
- **Serverless Backend**: Vercel Serverless Functions (`api/index.ts`)
- **AI Engine**: `@google/genai` (Google Gemini 2.5)

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ and npm installed on your system.

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Launch Full-Stack Server
Runs Express backend (`http://localhost:3001`) and Vite frontend (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

EventPulse is pre-configured for Vercel deployment with static frontend assets and Express serverless functions.

### Deploy via GitHub
1. Push this repository to GitHub.
2. Import the repository in your [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects `vercel.json` and builds both the React app and serverless API functions.
4. Add your `GEMINI_API_KEY` under **Project Settings ➔ Environment Variables**.

### Deploy via Vercel CLI
```bash
npx vercel
```

---

## 📄 License
Created for TechSummit 2025. All rights reserved.
