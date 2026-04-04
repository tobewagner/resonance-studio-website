# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **Resonance Studio Berlin**, a recording/mixing/mastering studio in Friedrichshain, Berlin. Vanilla HTML/CSS/JS, no build tools or frameworks.

## Development

- **Local**: Open `index.html` in a browser. No build step.
- **Dev server**: `http://192.168.1.16:8081` — deploy via `scp` to `/var/www/resonance-studio/` on `fuzzypoker_dev`. Own nginx server block on port 8081, completely separate from fuzzypoker.
- **Branch**: `feature/redesign`

## Architecture

- **index.html** — Sections: nav, hero, about, services, studio, gallery, clients bar (marquee), location (Leaflet map), contact form. Wave dividers between sections. JSON-LD structured data. Light/dark theme via `data-theme` on `<html>`. Both logo variants (red/beige) with CSS class switching.
- **styles.css** — CSS custom properties with light/dark theme (`[data-theme="light"]` / `[data-theme="dark"]`). JS sets `data-theme` on load (no `prefers-color-scheme` fallback). Responsive via `clamp()` and media queries at `550px`, `700px`. Gallery uses CSS columns masonry.
- **main.js** — IIFE: theme toggle (localStorage + cookie + system preference), email obfuscation, Leaflet map, hero parallax, IntersectionObserver scroll-reveal (also triggers wave divider animations), mobile menu, Formspree contact form.
- **lang-switcher.js** — Client-side i18n: loads `lang/strings.json`, detects language (URL param > cookie > localStorage > browser), swaps `[data-i18n]` text content. 26 languages. Cookie persistence (1 year).
- **lang/strings.json** — All translations. Flat key-value per language. 42 keys per language.

## External Dependencies

- **Leaflet 1.9.4** — CDN (unpkg) for location map
- **Formspree** — contact form backend (`YOUR_FORM_ID` placeholder)
- **flagcdn.com** — flag images for language switcher

## Design System

- **Font**: Sulphur Point (Light 300, Regular 400, Bold 700) — self-hosted TTF in `fonts/`. **MUST be used for ALL text. No other fonts. No italic variant exists.**
- **Color palette** (Resonance Color Space):
  - Warm: `#A47A4D` `#B48655` `#D6BDA0` `#F8F4EA` `#E7D9C5`
  - Reds: `#701321` `#871626` `#9D192A`
- **Dark mode**: bg `#2D0B12`, surface `#421018` (alternating), beige logo. Wave divider colors: `#310C14` `#360D16` `#3B0E18`
- **Light mode**: bg `#F8F4EA`, surface `#E7D9C5` (alternating), red logo. Wave divider colors: `#ECE0CF` `#F0E7D8` `#F4EEE1`
- **Wave dividers**: 3-layer organic SVG curves between sections. Overlap hero image at bottom. Scroll-triggered fade-in + breathe animation.
- **Gallery**: 60vw on desktop, 92vw on mobile. Masonry columns. Ripple glow via `::before` pseudo-element (z-index:-2) so all images (z-index:5) sit above all glows. `reveal` class on `.gallery__grid`, NOT on individual items. Cream glow on dark, burgundy on light, single play (no loop).

## Brand Info

- **Domain**: studio-resonance.net
- **Instagram**: @resonancestudioberlin
- **Contact**: resonance.studio.berlin@gmail.com
- **Studio Manager**: Matteo Hoyer
- **Studio built by**: Smart Audio GmbH (Christian Baumgarten), Hamburg — smart-audio.de
- **Logos**: `images/SRB-Logo-MH8b-full-beige.svg` (dark bg) / `images/SRB-Logo-MH8b-full-red.svg` (light bg)
- **Client logos**: `images/logos/` — dark/light variants (`*-white.webp` / `*-color.webp`). Source PNGs in `file_pool/customer_logos/` (`*_weiß.png` / `*_bunt.png`).
- **Gallery photos**: `images/gallery/` (WebP, auto-rotated from EXIF)
- **Source assets**: `file_pool/` (not deployed)
