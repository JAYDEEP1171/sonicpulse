# SonicPulse ⚡️ — Music Reflex Quiz Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**SonicPulse** is an adrenaline-fueled music reflex quiz platform built around the creative design philosophy of **"Sonic Kineticism"** (*The Pulse of the Neon Noir*).

Players test their musical recall against rapid 30-second audio previews, tapping a 4-pad reflex grid within fractions of a second to build multiplier streaks ($2\times, 3\times, 5\times$) and generate an Instagram Story-ready (9:16) **"Music DNA Report"**.

---

## 🏗 System Architecture

SonicPulse is structured as a full-stack web application designed for mobile-first play:

```
SPOTIFY/
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.jsx # Audio controller with visualizer & unlock handler
│   │   │   ├── Report.jsx      # 9:16 DNA Report card with PNG export
│   │   │   └── Timer.jsx       # SVG perimeter countdown timer (rAF + performance.now)
│   │   ├── App.jsx             # Main state machine (Auth -> Dashboard -> Game -> Report)
│   │   ├── index.css           # Global typography and base void styling
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   ├── tailwind.config.js      # Custom SonicPulse design tokens
│   └── vite.config.js
│
├── server/                     # Backend API (Flask + Python)
│   ├── app.py                  # API endpoints (/api/search, /api/artist/:id/tracks, /api/login)
│   ├── music_client.py         # Dual-engine music search (Deezer Primary + iTunes Fallback)
│   ├── spotify_client.py       # Spotify API Client Credentials client
│   ├── mock_data.py            # Local fallback catalog for offline development
│   └── requirements.txt
│
├── stitch/                     # UI/UX design mockups & design system specs
│   ├── PRD.md                  # Design-phase requirements reference
│   ├── README.md               # Stitch prototype overview
│   └── stitch/                 # Visual exports, code templates, and screens
│
├── PRD.md                      # Master Product Requirements Document (PRD v2.0)
└── README.md                   # Master Documentation (This file)
```

---

## ⚡️ Key Features Built Till Now

1. **Dual-Engine Audio Resolution:**
   - Primary: **Deezer API** (Unauthenticated, delivers direct 30-second MP3 previews and album art).
   - Secondary: **Apple iTunes API** (Fallback when Deezer yields no previews, upgrades album art to $600\times600\text{px}$).
   - Offline Mock: Configurable `MOCK_MODE=true` for testing without internet access.

2. **High-Precision SVG Perimeter Timer:**
   - Smooth $360^\circ$ animated square perimeter border countdown powered by `requestAnimationFrame` and microsecond timing from `performance.now()`.
   - Dynamic danger pulse animation when timer reaches $< 3\text{s}$.

3. **Multi-Tier Reflex Scoring Engine:**
   - Reaction time measurement down to fractional milliseconds.
   - **Super Reflex** ($t \le 1.2\text{s}$): $1.5\times$ point bonus + combo streak acceleration.
   - **Streak Multipliers**: Up to $5\times$ multiplier on consecutive correct taps.
   - Miss penalty: $-500$ points and streak reset.

4. **Viral 9:16 Music DNA Report:**
   - 9:16 aspect ratio card formatted for Instagram Stories / TikTok / Snapchat.
   - Calculates **Accuracy %**, **Performance Tier** (`ELITE`, `PRO`, `CASUAL`, `NOVICE`), and **Average Reflex Speed** in seconds.
   - Client-side high-resolution PNG generation via `html-to-image`.

5. **"Sonic Kineticism" Design Language:**
   - Obsidian void background (`#0E0E0E`) with Electric Neon Green accents (`#72FE8F`).
   - "No-Line" visual hierarchy (depth achieved via surface layering `#131313` $\to$ `#262626`).
   - Glassmorphic floating bottom navigation dock.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.11+ recommended)

---

### 1. Backend Setup (Flask Server)

```bash
cd server

# Create and activate virtual environment
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS / Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python app.py
```
> The backend server will run at: `http://localhost:5000`

**Default Credentials:**
- **Username:** `admin`
- **Password:** `pass123`

---

### 2. Frontend Setup (React Client)

```bash
cd client

# Install packages
npm install

# Start Vite development server
npm run dev
```
> The frontend client will run at: `http://localhost:5173`

---

## 🗺 Implementation Roadmap

For complete details on functional requirements and technical specifications, refer to [PRD.md](file:///E:/All%20Other/SPOTIFY/PRD.md).

- **[x] Phase 1:** Core Visual Design, Prototyping & Dual-Engine Music Discovery (Deezer + iTunes).
- **[x] Phase 2 (Partial):** Interactive 10-round game loop, perimeter SVG timer, reaction scoring, and DNA report PNG export.
- **[ ] Phase 3:** Frontend modularization (refactor monolithic `App.jsx` into feature directories), Web Audio API (`AudioContext`) implementation, and server-side distractor generator.
- **[ ] Phase 4:** Persistent database (PostgreSQL / Supabase) for user high scores, global percentile ranking, and Web Share API Level 2 mobile integration.
- **[ ] Phase 5:** Real-time 1v1 multiplayer duels via WebSockets, Bluetooth audio latency calibration, and installable PWA.

---

## 📄 Documentation Index
- **[PRD.md](file:///E:/All%20Other/SPOTIFY/PRD.md)** — Master Product Requirements Document.
- **[DESIGN.md](file:///E:/All%20Other/SPOTIFY/stitch/stitch/sonic_pulse/DESIGN.md)** — UI/UX Design System Specification.
- **[stitch/README.md](file:///E:/All%20Other/SPOTIFY/stitch/README.md)** — Design prototype catalog.
