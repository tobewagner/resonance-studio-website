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
        var tc = document.querySelector('meta[name="theme-color"]');
        if (tc) tc.setAttribute('content', theme === 'light' ? '#F8F4EA' : '#2D0B12');
    }

    // Apply immediately to prevent flash
    applyTheme(getPreferredTheme());

    var heroLogo = document.querySelector('.hero__logo:not([style*="display: none"])') || document.querySelector('.hero__logo');
    var heroRule = document.querySelector('.hero__rule');
    var heroSub  = document.querySelector('.hero__sub');
    var glowEls  = [heroLogo, heroRule, heroSub].filter(Boolean);

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var current = root.getAttribute('data-theme') || 'dark';
            // Hide glow before switch
            glowEls.forEach(function (el) { el.style.filter = 'none'; el.style.boxShadow = 'none'; el.style.textShadow = 'none'; });
            applyTheme(current === 'dark' ? 'light' : 'dark');
            // Restore glow after repaint
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    glowEls.forEach(function (el) { el.style.filter = ''; el.style.boxShadow = ''; el.style.textShadow = ''; });
                });
            });
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

    /* ---------- Anchor scroll within #page-scroll ---------- */
    var pageScroll = document.getElementById('page-scroll');
    if (pageScroll) {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var target = document.querySelector(id);
                if (target && pageScroll.contains(target)) {
                    e.preventDefault();
                    pageScroll.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                }
            });
        });
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
    var scroller    = document.getElementById('page-scroll');
    var heroH       = hero ? hero.offsetHeight : 0;
    var scrollTick  = false;

    window.addEventListener('resize', function () {
        heroH = hero ? hero.offsetHeight : 0;
    }, { passive: true });

    function onScroll() {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(function () {
            var scrollY = scroller ? scroller.scrollTop : window.scrollY;
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

    (scroller || window).addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Gallery masonry columns ---------- */
    var galleryGrid = document.querySelector('.gallery__grid');
    if (galleryGrid) {
        var galleryItems = Array.prototype.slice.call(galleryGrid.querySelectorAll('.gallery__item'));
        var galleryCols = 0;

        function galleryLayout() {
            var cols = window.innerWidth >= 700 ? 3 : 2;
            if (cols === galleryCols) return;
            galleryCols = cols;

            // Remove existing column divs
            galleryGrid.innerHTML = '';

            // Create column containers
            var colDivs = [];
            for (var c = 0; c < cols; c++) {
                var col = document.createElement('div');
                col.className = 'gallery__col';
                galleryGrid.appendChild(col);
                colDivs.push(col);
            }

            // Distribute items round-robin
            for (var i = 0; i < galleryItems.length; i++) {
                colDivs[i % cols].appendChild(galleryItems[i]);
            }
        }

        galleryLayout();
        window.addEventListener('resize', galleryLayout);
    }

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
        }, { root: scroller || null, threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

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
    /* ---------- Ticker (rAF-based, iOS-safe) ---------- */
    var ticker = document.getElementById('ticker');
    var tTrack = document.getElementById('ticker-track');

    if (ticker && tTrack) {
        var tBaseSpeed = 0.96;  // 20% slower than 1.2
        var tVelocity  = -tBaseSpeed;
        var tIsMobile  = 'ontouchstart' in window;
        var tFriction  = tIsMobile ? 0.99 : 0.995;
        var tRecovery  = 0.0014;
        var tOffset    = 0;
        var tSetW      = 0;
        var tOrigHTML  = tTrack.innerHTML;
        var tReady     = false;
        var tDrag      = false;
        var tStartX    = 0;
        var tBaseOff   = 0;
        var tLastX     = 0;
        var tLastTime  = 0;

        function tBuild() {
            // Start with one set, measure it
            tTrack.innerHTML = tOrigHTML;

            // Wait for all images in the track to load, then measure + clone
            var imgs = tTrack.querySelectorAll('img');
            var loaded = 0;
            var total = imgs.length;

            function onAllLoaded() {
                // Measure one set: total width of all children + gaps
                var gap = parseFloat(getComputedStyle(tTrack).gap) || 0;
                var items = tTrack.children;
                tSetW = 0;
                for (var i = 0; i < items.length; i++) {
                    tSetW += items[i].getBoundingClientRect().width;
                    if (i < items.length - 1) tSetW += gap;
                }
                tSetW += gap; // trailing gap before next set

                // Clone enough sets to cover viewport + 2 extra
                var copies = Math.ceil(window.innerWidth / tSetW) + 2;
                for (var c = 0; c < copies; c++) {
                    tTrack.innerHTML += tOrigHTML;
                }

                // Mark aria-hidden on clones
                var allItems = tTrack.children;
                var origCount = items.length;
                for (var j = origCount; j < allItems.length; j++) {
                    allItems[j].setAttribute('aria-hidden', 'true');
                }

                tReady = true;
            }

            if (total === 0) { onAllLoaded(); return; }
            for (var i = 0; i < total; i++) {
                if (imgs[i].complete) {
                    loaded++;
                    if (loaded === total) onAllLoaded();
                } else {
                    imgs[i].addEventListener('load', function () {
                        loaded++;
                        if (loaded === total) onAllLoaded();
                    });
                    imgs[i].addEventListener('error', function () {
                        loaded++;
                        if (loaded === total) onAllLoaded();
                    });
                }
            }
        }

        function tWrap() {
            // Smooth modulo — never jumps because content repeats
            tOffset = ((tOffset % tSetW) + tSetW) % tSetW;
            if (tOffset > 0) tOffset -= tSetW;
        }

        // Recovery: reach -tBaseSpeed in ~2s at 60fps = 120 frames
        var tAccel = tBaseSpeed / 120;

        function tLoop() {
            if (tReady) {
                if (!tDrag) {
                    tOffset += tVelocity;

                    var target = -tBaseSpeed;
                    var diff = target - tVelocity;

                    if (Math.abs(diff) < 0.01) {
                        // At target speed
                        tVelocity = target;
                    } else if (Math.abs(tVelocity) > tBaseSpeed * 1.2) {
                        // Phase 1: fast momentum — apply friction to slow down
                        tVelocity *= tFriction;
                    } else {
                        // Phase 2: slow or stopped — linear accel toward target
                        if (diff < 0) {
                            tVelocity -= tAccel;
                            if (tVelocity < target) tVelocity = target;
                        } else {
                            tVelocity += tAccel;
                            if (tVelocity > target) tVelocity = target;
                        }
                    }
                }
                tWrap();
                tTrack.style.transform = 'translate3d(' + tOffset + 'px,0,0)';
            }
            requestAnimationFrame(tLoop);
        }

        function tDown(e) {
            if (!tReady) return;
            tDrag = true;
            ticker.classList.add('is-dragging');
            tBaseOff = tOffset;
            var pt = e.touches ? e.touches[0] : e;
            tStartX = pt.clientX;
            tLastX = pt.clientX;
            tLastTime = Date.now();
            if (e.type === 'mousedown') e.preventDefault();
        }

        function tMove(e) {
            if (!tDrag) return;
            var pt = e.touches ? e.touches[0] : e;
            var now = Date.now();
            var dt = now - tLastTime;
            if (dt > 0) {
                tVelocity = (pt.clientX - tLastX) / Math.max(dt, 8) * 16;
            }
            tLastX = pt.clientX;
            tLastTime = now;
            tOffset = tBaseOff + (pt.clientX - tStartX);
        }

        function tUp() {
            if (!tDrag) return;
            tDrag = false;
            ticker.classList.remove('is-dragging');
            // tVelocity already set from last tMove — momentum continues
        }

        ticker.addEventListener('mousedown', tDown);
        ticker.addEventListener('touchstart', tDown, { passive: true });
        window.addEventListener('mousemove', tMove);
        window.addEventListener('touchmove', tMove, { passive: true });
        window.addEventListener('mouseup', tUp);
        window.addEventListener('touchend', tUp);

        tBuild();
        requestAnimationFrame(tLoop);
        window.addEventListener('resize', function () { tReady = false; tBuild(); });
    }

    /* ---------- Content protection ---------- */
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('copy', function (e) { e.preventDefault(); });
})();
