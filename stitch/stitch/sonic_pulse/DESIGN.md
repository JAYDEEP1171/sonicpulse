```markdown
# Design System Strategy: The Sonic Kineticism

## 1. Overview & Creative North Star
**Creative North Star: "The Pulse of the Neon Noir"**

This design system is not a static interface; it is a high-octane, rhythmic environment designed for a music reflex quiz app. To move beyond a "generic dark mode," we lean into **Sonic Kineticism**. This approach treats the UI as a living equalizer—highly responsive, dark-as-void, and punctuated by "light-speed" accents.

The system breaks the standard "boxed-in" template by utilizing **intentional asymmetry** and **tonal depth**. Instead of rigid rows, we use staggered 2x2 grids and overlapping square imagery to create a sense of motion. By contrasting the deep, ink-like blacks of the background with the hyper-vibrant `primary` (#72FE8F), we create a high-energy visual "snap" that mirrors the quick reflexes required by the app.

---

## 2. Colors & Surface Philosophy
The palette is built on the physics of light in a dark room. The base is an absolute void, allowing the neon accents to "glow" through the screen.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited.** Sectioning must be achieved through background shifts. 
- Use `surface-container-low` (#131313) for large sections.
- Use `surface-container-high` (#20201F) for interactive elements within those sections.
- If a boundary feels missing, increase the `spacing` scale rather than adding a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, matte-finish plates.
- **Level 0 (Base):** `surface` (#0E0E0E) - The canvas.
- **Level 1 (Sections):** `surface-container` (#1A1A1A) - For secondary content areas.
- **Level 2 (Cards/Actions):** `surface-container-highest` (#262626) - The primary interactive layer.

### The "Glass & Gradient" Rule
To elevate the "premium" feel, floating elements (like music players or score overlays) should use **Glassmorphism**. 
- **Recipe:** `surface-container-high` at 70% opacity + 20px Backdrop Blur.
- **Signature Texture:** Use a subtle linear gradient from `primary` (#72FE8F) to `primary-container` (#1CB854) at a 135° angle for hero buttons and progress bars to simulate a neon tube.

---

## 3. Typography: The Editorial Beat
We use a high-contrast scale to guide the eye during fast-paced gameplay.

- **Display & Headlines:** *Plus Jakarta Sans*. This typeface offers a geometric, premium feel. Use `display-lg` (3.5rem) for scores and "GO" states to create massive impact.
- **Body & Labels:** *Inter*. Chosen for its extreme legibility at small sizes during rapid interaction.
- **The Hierarchy:** Large, bold headlines convey authority, while tiny, tracked-out `label-sm` (0.6875rem) in `on-surface-variant` (#ADAAAA) provides a technical, "pro-audio" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0" for this system. We use light, not shadow.

*   **The Layering Principle:** Achieve lift by placing a `surface-container-highest` card on a `surface-dim` background. The color contrast *is* the elevation.
*   **Ambient Shadows:** For "Floating Action Buttons" or high-priority modals, use a shadow with a `24px` blur, `0%` spread, and `8%` opacity, using the `primary` color as the shadow tint. This mimics a neon glow reflecting off a black surface.
*   **The Ghost Border Fallback:** If accessibility requires a stroke (e.g., in high-glare environments), use `outline-variant` at 15% opacity. It should feel like a suggestion of a border, not a hard edge.

---

## 5. Components & UI Patterns

### Buttons
*   **Primary (Reflex Action):** Background: `primary` (#72FE8F), Type: `on-primary` (#005F26) Bold. Roundedness: `md` (0.75rem).
*   **Secondary:** Background: `surface-container-highest`, Type: `on-surface`.
*   **Tertiary:** No background, `primary` text with an underline on hover.

### 2x2 Grid Cards
*   **Music Cards:** Strictly square imagery. Use `roundedness-lg` (1rem). 
*   **Anti-Divider Rule:** Never use lines between list items. Use `spacing-4` (1rem) as the minimum vertical gap or alternate between `surface-container-low` and `surface-container-lowest` backgrounds.

### Pulse Progress Bars
*   **Track:** `surface-variant` (#262626).
*   **Indicator:** Linear gradient `primary` to `primary-dim`. 
*   **Animation:** Add a 2px outer glow (drop-shadow) to the leading edge of the progress bar to simulate a "moving spark."

### Specialized Reflex Components
*   **The "Haptic" Input:** Large, square pads for quiz answers. On tap, they should flash `primary` and scale down to 95% to provide tactile feedback.
*   **Score Counter:** Use `display-lg` with `tertiary` (#88EBFF) color for a "high-score" state to differentiate from the standard UI.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme white space. A music quiz needs "breathing room" to keep the user from feeling overwhelmed.
*   **Do** use `primary` sparingly. It is a laser, not a paint bucket. If everything is green, nothing is important.
*   **Do** stagger your 2x2 grids slightly (e.g., a 4px vertical offset) to create a more "editorial" and custom feel.

### Don’t:
*   **Don’t** use pure white (#FFFFFF) for body text. Use `on-surface-variant` (#ADAAAA) for secondary info to maintain the dark-room atmosphere.
*   **Don’t** use "default" 4px rounded corners. It feels dated. Stick to the `md` (12px) and `lg` (16px) tokens to feel modern and "soft-tech."
*   **Don’t** use standard "Slide-in" transitions. Use "Scale and Fade" (0.95x to 1.0x) to mimic the popping of a beat.

---
**Director's Note:** This system succeeds when it feels like a high-end audio hardware interface. It is dark, it is heavy, and it is expensive. Every pixel of `primary` green should feel like a surge of electricity.```