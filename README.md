# Resonance Studio Berlin

Website for **Resonance Studio Berlin** — a professional recording, mixing and mastering studio in Friedrichshain, Berlin.

**Live:** [studio-resonance.net](https://studio-resonance.net)

![Resonance Studio Berlin](images/SRB-Logo-MH8b-full-red.svg)

## About

Static single-page website built with vanilla HTML, CSS and JavaScript. No frameworks, no build tools — just open `index.html` in a browser.

## Features

- **Light / Dark theme** — respects `prefers-color-scheme`, toggleable, persisted via localStorage & cookie
- **26 languages** — client-side i18n with auto-detection (URL param > cookie > browser language)
- **Gallery** — masonry layout with ripple glow animations
- **Scroll animations** — IntersectionObserver-driven reveal effects and wave divider transitions
- **Contact form** — powered by Formspree
- **Google Maps** — embedded studio location
- **Client ticker** — requestAnimationFrame-based marquee with drag momentum
- **SEO** — JSON-LD structured data, Open Graph, Twitter Cards, sitemap, robots.txt

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, `clamp()`, media queries) |
| Scripts | Vanilla JavaScript (ES6+) |
| Font | Sulphur Point (self-hosted TTF) |
| Maps | Google Maps embed |
| Forms | Formspree |
| Flags | flagcdn.com |

## Project Structure

```
index.html          Main page
styles.css          All styles (light/dark themes, responsive)
main.js             Theme toggle, scroll effects, map, form, ticker
lang-switcher.js    Client-side i18n engine
lang/strings.json   Translations (26 languages, 42 keys each)
fonts/              Sulphur Point TTF files
images/             Gallery, logos, hero images
images/logos/       Client logos (dark/light variants)
legal.html          Legal notice (Impressum)
privacy.html        Privacy policy
robots.txt          Crawler directives
sitemap.xml         Sitemap for search engines
file_pool/          Source assets (not deployed)
```

## Development

No build step required.

```bash
# Just open in a browser
open index.html
```

## Design

- **Font**: Sulphur Point (Light, Regular, Bold)
- **Dark mode**: Deep burgundy background (`#2D0B12`), beige logo
- **Light mode**: Warm cream background (`#F8F4EA`), red logo
- **Wave dividers**: 3-layer organic SVG curves between sections with scroll-triggered animations

## Contact

- **Studio Manager**: Matteo Hoyer
- **Email**: resonance.studio.berlin@gmail.com
- **Instagram**: [@resonancestudioberlin](https://instagram.com/resonancestudioberlin)
- **Location**: Boxhagener Str. 18, 10245 Berlin (Friedrichshain)
