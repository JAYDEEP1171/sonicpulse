# SonicPulse ⚡️ — Design Prototypes & Stitch UI Exports

> **Subdirectory:** Design mockups, screen exports, and design system reference files.  
> **Master Documentation:** For the full-stack application and active codebase, see the root [README.md](file:///E:/All%20Other/SPOTIFY/README.md) and [PRD.md](file:///E:/All%20Other/SPOTIFY/PRD.md).

---

## 📂 Stitch Folder Structure

```
stitch/
├── PRD.md                                    # Design-phase requirements reference
├── README.md                                 # Stitch subdirectory overview (this file)
└── stitch/                                   # Visual design system and screen exports
    ├── sonic_pulse/
    │   └── DESIGN.md                         # Core design system specification ("The Sonic Kineticism")
    │
    ├── sonicpulse_search_adjusted_nav/       # Screen 1: Home / Discovery / Artist Search
    │   ├── code.html                         # Tailwind CSS + Material Symbols prototype
    │   └── screen.png                        # Rendered visual mockup
    │
    ├── sonicpulse_gameplay/                  # Screen 2: Real-time Reflex Gameplay
    │   ├── code.html                         # Gameplay screen with album timer & answer grid
    │   └── screen.png                        # Rendered visual mockup
    │
    └── sonicpulse_final_dna_report/          # Screen 3: Post-Game Performance DNA Report
        ├── code.html                         # Instagram Story (9:16) performance recap
        └── screen.png                        # Rendered visual mockup
```

---

## 🎨 Design System Summary ([DESIGN.md](file:///E:/All%20Other/SPOTIFY/stitch/stitch/sonic_pulse/DESIGN.md))

- **Aesthetic:** "Sonic Kineticism" / Neon Noir Cyberpunk.
- **Palette:** Obsidian Void (`#0E0E0E`), Electric Neon Green (`#72FE8F`), Surface Nesting (`#131313` through `#262626`).
- **Core Principle:** "No-Line" rule (layering and depth achieved through subtle surface tonal contrast rather than 1px borders).
- **Typography:** *Plus Jakarta Sans* (headlines, scores, metrics) + *Inter* (data labels, body text).
- **Haptics & Animation:** Snappy tactile micro-interactions on button press with active glowing states.

---

## 🔗 Active Implementation Links

- **React Client:** [`client/`](file:///E:/All%20Other/SPOTIFY/client/)
- **Flask Backend:** [`server/`](file:///E:/All%20Other/SPOTIFY/server/)
- **Master PRD:** [PRD.md](file:///E:/All%20Other/SPOTIFY/PRD.md)
- **Master README:** [README.md](file:///E:/All%20Other/SPOTIFY/README.md)
