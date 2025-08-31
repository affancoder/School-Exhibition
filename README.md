# Premier Schools Exhibition — Modern Hero UI

A responsive, modern landing hero built with semantic HTML, modern CSS, and lightweight JavaScript. It uses animated visual elements and glassmorphism to create a polished look that’s easy to customize.

## Overview
- Clean, accessible layout with semantic structure
- Eye‑catching hero with a vibrant gradient background
- Vertical animated image gallery (3 floating columns) for visual storytelling
- Left promotional ad redesigned per provided reference (kicker, bold headline, subkicker, pill info)
- Right glassmorphic "Enquire Now" form card
- Mobile‑friendly and performant (no heavy frameworks)

## Tech Stack
- HTML5 (semantic)
- CSS3 (custom properties, clamp(), gradients, animations)
- Vanilla JavaScript (minimal slider/init logic, no dependencies)

## Key UI Pieces
- Hero background: diagonal multi‑color gradient with subtle radial highlights for depth
- Animated gallery: three vertical columns gently floating via CSS keyframes
- Left promo ad: matches provided design (kicker → headline → subkicker → pill info with divider)
- Enquiry card: glassmorphism (blur + translucent panel), accessible form controls

## Project Structure
```
company task/
├─ index.html          # Page markup
├─ css/
│  └─ styles.css       # All styles (hero, gallery, enquiry card, promo ad)
├─ js/
│  └─ main.js          # Minimal hero slider init (controls optional)
└─ assets/
   ├─ images/          # Images, logo, gallery visuals
   └─ ...
```

## Getting Started
1. Open `index.html` in your browser.
2. Ensure assets under `assets/images/` exist (the gallery uses event/school images).
3. Optionally serve via a local server for best caching/paths.

## Customization
- Colors and background
  - Edit `css/styles.css` → `.hero` gradient and `::before/::after` overlays
- Animated gallery
  - Column widths: `.hero-gallery__col--left|center|right`
  - Float speed/amplitude: `@keyframes floatY`
  - Shape sizes: `.shape--pill`, `.shape--arch`
- Left promo ad
  - Text: `index.html` inside `<aside class="hero-ad">`
  - Styles: `.hero-ad__kicker`, `.hero-ad__headline`, `.hero-ad__subkicker`, `.hero-ad__info`
- Enquiry form card
  - Position/spacing: `.enquiry-card` (top/right)
  - Inputs/buttons: `.enquiry-card input|select`, `.enquiry-card__submit`
- Responsiveness
  - Breakpoint tweaks at `@media (max-width: 1280px)` and `@media (max-width: 1024px)`

## Accessibility
- Decorative gallery uses `aria-hidden="true"` and empty `alt` attributes
- Form inputs have associated labels and `aria-live` region for feedback
- High‑contrast buttons and readable typography

## Favicon
- `index.html` includes an SVG favicon reference at `assets/images/logo.svg`. Add PNG fallbacks if needed.

## Notes
- No build process required. Pure HTML/CSS/JS.
- You can deploy to any static host (e.g., Netlify, Vercel, GitHub Pages).

---
Built to showcase a modern animated hero with strong visual hierarchy and easy theming.

## Appreciation

Built with appreciation by MD Affan Asghar.
