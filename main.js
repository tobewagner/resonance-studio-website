/* =============================================
   Resonance Studio Berlin — Main JS
   ============================================= */

(function () {
    'use strict';

    /* ---------- Theme (light/dark) ---------- */
    var root = document.documentElement;
    var themeBtn = document.getElementById('theme-toggle');

    function getPreferredTheme() {
        var stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Apply immediately to prevent flash
    applyTheme(getPreferredTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var current = root.getAttribute('data-theme') || 'dark';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    /* ---------- Page loaded state ---------- */
    // Triggers hero entrance animations via CSS
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    /* ---------- Email obfuscation ---------- */
    var parts = ['resonance', '.studio', '.berlin', '@', 'gmail', '.com'];
    var addr  = parts[0] + parts[1] + parts[2] + parts[3] + parts[4] + parts[5];

    var emailContainer = document.getElementById('email-link');
    if (emailContainer) {
        var a = document.createElement('a');
        a.href = 'mai' + 'lto:' + addr;
        a.textContent = addr;
        emailContainer.appendChild(a);
    }

    /* ---------- Mobile menu ---------- */
    var burger     = document.getElementById('nav-burger');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuLinks  = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link') : [];

    function toggleMenu() {
        var isOpen = mobileMenu.classList.toggle('open');
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (burger && mobileMenu) {
        burger.addEventListener('click', toggleMenu);

        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', closeMenu);
        }
    }

    /* ---------- Leaflet map ---------- */
    var LAT = 52.51334;
    var LNG = 13.45558;

    var map = L.map('map', {
        center: [LAT, LNG],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var markerIcon = L.divIcon({
        className: 'map-marker',
        html: '<svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 28 16 28s16-16 16-28C32 7.164 24.836 0 16 0z" fill="#9D192A"/>' +
              '<circle cx="16" cy="15" r="6" fill="rgb(248,244,234)"/>' +
              '</svg>',
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

    /* ---------- Hero parallax + Nav (combined scroll handler) ---------- */
    var nav         = document.querySelector('.nav');
    var heroContent = document.querySelector('.hero__content');
    var hero        = document.querySelector('.hero');
    var heroH       = hero ? hero.offsetHeight : 0;
    var scrollTick  = false;

    window.addEventListener('resize', function () {
        heroH = hero ? hero.offsetHeight : 0;
    }, { passive: true });

    function onScroll() {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(function () {
            var scrollY = window.scrollY;
            if (scrollY < heroH && heroContent) {
                heroContent.style.transform = 'translateY(' + scrollY * 0.3 + 'px)';
                heroContent.style.opacity   = 1 - scrollY / (heroH * 0.8);
            }
            if (nav) {
                if (scrollY > 50) {
                    nav.classList.add('nav--scrolled');
                } else {
                    nav.classList.remove('nav--scrolled');
                }
            }
            scrollTick = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll reveal ---------- */
    var reveals = document.querySelectorAll('.reveal, .wave-divider');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        reveals.forEach(function (el) { revealObserver.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ---------- Contact form (Formspree) ---------- */
    var form   = document.getElementById('contact-form');
    var status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var honeypot = form.querySelector('[name="website"]');
            if (honeypot && honeypot.value) {
                status.textContent = 'Thank you! Your message has been sent.';
                form.reset();
                return;
            }

            var data = new FormData(form);

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
