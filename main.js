/* =============================================
   Resonance Studio Berlin — Main JS
   ============================================= */

(function () {
    'use strict';

    /* ---------- Email obfuscation ---------- */
    // Assembled at runtime so scrapers can't find the address in the source
    const parts = ['resonance', '.studio', '.berlin', '@', 'gmail', '.com'];
    const addr  = parts[0] + parts[1] + parts[2] + parts[3] + parts[4] + parts[5];

    const emailContainer = document.getElementById('email-link');
    if (emailContainer) {
        const a = document.createElement('a');
        a.href = 'mai' + 'lto:' + addr;
        a.textContent = addr;
        emailContainer.appendChild(a);
    }

    /* ---------- Leaflet map ---------- */
    const LAT = 52.51334;
    const LNG = 13.45558;

    const map = L.map('map', {
        center: [LAT, LNG],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false
    });

    // OpenStreetMap tiles (we darken/re-hue them via CSS filter)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Custom marker with a burgundy SVG icon
    const markerIcon = L.divIcon({
        className: 'map-marker',
        html: `
            <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 28 16 28s16-16 16-28C32 7.164 24.836 0 16 0z"
                      fill="rgb(147,31,50)"/>
                <circle cx="16" cy="15" r="6" fill="rgb(248,244,234)"/>
            </svg>
        `,
        iconSize: [32, 44],
        iconAnchor: [16, 44],
        popupAnchor: [0, -40]
    });

    L.marker([LAT, LNG], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
            '<strong>Resonance Studio Berlin</strong><br>' +
            'Boxhagener Str. 18, Hinterhof 2<br>' +
            '10245 Berlin'
        );

    /* ---------- Hero parallax ---------- */
    const heroContent = document.querySelector('.hero__content');
    const hero = document.querySelector('.hero');

    function onScroll() {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;

        // Only run while hero is in view
        if (scrollY < heroH && heroContent) {
            heroContent.style.transform = 'translateY(' + scrollY * 0.35 + 'px)';
            heroContent.style.opacity = 1 - scrollY / heroH;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Scroll reveal (once) ---------- */
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(function (el) { observer.observe(el); });
    } else {
        // Fallback: show everything immediately
        reveals.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ---------- Navbar background on scroll ---------- */
    const nav = document.querySelector('.nav');

    function updateNav() {
        if (!nav) return;
        if (window.scrollY > 40) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    /* ---------- Contact form (Formspree) ---------- */
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Honeypot check — if filled, silently pretend success
            const honeypot = form.querySelector('[name="website"]');
            if (honeypot && honeypot.value) {
                status.textContent = 'Thank you! Your message has been sent.';
                form.reset();
                return;
            }

            const data = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(function (response) {
                if (response.ok) {
                    status.textContent = 'Thank you! Your message has been sent.';
                    form.reset();
                } else {
                    status.textContent = 'Oops — something went wrong. Please try again or email us directly.';
                }
            })
            .catch(function () {
                status.textContent = 'Oops — something went wrong. Please try again or email us directly.';
            });
        });
    }
})();
