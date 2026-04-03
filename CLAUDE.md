# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **Resonance Studio Berlin**, a recording/mixing/mastering studio in Friedrichshain, Berlin. No build tools, bundlers, or frameworks — just vanilla HTML/CSS/JS served directly.

## Development

Open `index.html` in a browser. No build step, no dev server required. Any static file server works (e.g. `python -m http.server` or VS Code Live Server).

## Architecture

- **index.html** — Single-page structure with sections: nav, hero, about, location (Leaflet map), contact form, footer. Uses JSON-LD structured data for SEO.
- **styles.css** — All styles in one file. Uses CSS custom properties defined in `:root` for the color palette (dark bg, burgundy, gold, cream/beige). Responsive via `clamp()` and media queries at `700px`. Includes Leaflet map overrides with dark-themed filters.
- **main.js** — IIFE with: email obfuscation (anti-scraper assembly), Leaflet map init with custom SVG marker, hero parallax on scroll, IntersectionObserver scroll-reveal, navbar background toggle, and Formspree contact form submission via fetch.

## External Dependencies

- **Leaflet 1.9.4** — loaded via CDN (unpkg) for the location map
- **Formspree** — contact form backend (action URL placeholder `YOUR_FORM_ID` needs replacing)

## Design System

- **Font**: Sulphur Point (Light 300, Regular 400, Bold 700) — self-hosted TTF files in `fonts/`
- **Colors**: `--color-bg` (dark), `--color-surface` (slightly lighter dark), `--color-burgundy` (accent), `--color-gold` (links/highlights), `--color-cream`/`--color-beige` (text)
- **Domain**: studio-resonance.net (referenced in canonical URL and OG tags)
