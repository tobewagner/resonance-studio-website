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
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        return 'dark';
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

    /* ---------- Wave divider SVG injection ---------- */
    var wavePaths = {
        bg:      ['M0,60 C240,20 480,100 720,50 C960,0 1200,80 1440,60',
                  'M0,100 C240,60 480,140 720,90 C960,40 1200,120 1440,100',
                  'M0,145 C240,105 480,185 720,135 C960,85 1200,165 1440,145',
                  'M0,180 C240,145 480,210 720,170 C960,130 1200,200 1440,180'],
        surface: ['M0,60 C240,100 480,20 720,70 C960,120 1200,40 1440,60',
                  'M0,100 C240,140 480,60 720,110 C960,160 1200,80 1440,100',
                  'M0,145 C240,185 480,105 720,155 C960,205 1200,125 1440,145',
                  'M0,180 C240,210 480,145 720,190 C960,220 1200,160 1440,180']
    };

    document.querySelectorAll('.wave-divider').forEach(function (div) {
        var paths = div.classList.contains('wave-divider--to-bg') ? wavePaths.bg : wavePaths.surface;
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1440 220');
        svg.setAttribute('preserveAspectRatio', 'none');
        paths.forEach(function (d, i) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'wave-layer wave-layer--' + (i + 1));
            path.setAttribute('d', d + ' L1440,220 L0,220 Z');
            svg.appendChild(path);
        });
        div.appendChild(svg);
    });

    /* ---------- Page loaded state ---------- */
    // Triggers hero entrance animations via CSS
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    /* ---------- Email obfuscation ---------- */
    var parts = ['resonance', '.studio', '.berlin', '@', 'gmail', '.com'];
    var addr  = parts[0] + parts[1] + parts[2] + parts[3] + parts[4] + parts[5];

    ['email-link'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            var a = document.createElement('a');
            a.href = 'mai' + 'lto:' + addr;
            a.textContent = addr;
            el.appendChild(a);
        }
    });

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
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        if (nav) {
            if (isOpen) {
                nav.classList.add('nav--menu-open');
            } else {
                nav.classList.remove('nav--menu-open');
            }
        }
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (nav) {
            nav.classList.remove('nav--menu-open');
        }
    }

    if (burger && mobileMenu) {
        burger.addEventListener('click', toggleMenu);

        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', closeMenu);
        }
    }

    /* ---------- Nav responsive fit ---------- */
    var nav         = document.getElementById('nav');
    var navInner    = document.querySelector('.nav__inner');
    var navLinks    = document.getElementById('nav-links');
    var navActions  = document.querySelector('.nav__actions');
    var logoLink    = document.querySelector('.nav__logo-link');
    var linkEls     = navLinks ? [].slice.call(navLinks.children) : [];

    function navFit() {
        if (!navInner || !navLinks || !navActions || !logoLink) return;

        // Reset: show all links, full logo, hide burger
        for (var i = 0; i < linkEls.length; i++) linkEls[i].style.display = '';
        nav.classList.remove('nav--compact');
        navLinks.style.display = 'flex';
        burger.style.display = 'none';

        // Mobile: always burger only
        if (window.innerWidth <= 700) {
            for (var m = 0; m < linkEls.length; m++) linkEls[m].style.display = 'none';
            navLinks.style.display = 'none';
            burger.style.display = 'flex';
            return;
        }

        var containerW = navInner.offsetWidth;
        var actionsW   = navActions.offsetWidth;
        var GAP        = 24;

        function usedWidth() {
            return logoLink.offsetWidth + GAP + navLinks.scrollWidth + GAP + actionsW;
        }

        // Step 1: swap to icon logo if needed
        if (usedWidth() > containerW) {
            nav.classList.add('nav--compact');
        }

        // Step 2: hide links from right until it fits
        var hiddenCount = 0;
        for (var j = linkEls.length - 1; j >= 0; j--) {
            if (usedWidth() <= containerW) break;
            linkEls[j].style.display = 'none';
            hiddenCount++;
        }

        // Step 3: if too few links remain, hide all → burger only + full logo
        var visibleCount = linkEls.length - hiddenCount;
        if (hiddenCount > 0 && visibleCount <= 2) {
            for (var k = 0; k < linkEls.length; k++) linkEls[k].style.display = 'none';
            navLinks.style.display = 'none';
            nav.classList.remove('nav--compact'); // full logo for burger mode
            burger.style.display = 'flex';
        } else if (hiddenCount > 0) {
            burger.style.display = 'flex';
        }

        // Close mobile menu if all links visible again
        if (hiddenCount === 0 && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    }

    navFit();
    window.addEventListener('resize', navFit);
    window.addEventListener('langchange', function () {
        requestAnimationFrame(navFit);
    });


    /* ---------- Hero parallax + Nav (combined scroll handler) ---------- */
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
            galleryGrid.replaceChildren();

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

    /* ---------- Contact form (Web3Forms) ---------- */
    var form       = document.getElementById('contact-form');
    var status     = document.getElementById('form-status');
    var formBtn    = document.getElementById('form-button');
    var btnText    = formBtn ? formBtn.querySelector('.form__button-text') : null;
    var WEB3FORMS_KEY = '3243cf91-6273-4e4d-a23a-5aa00a6cf094';

    function i18n(key, fallback) {
        var i = window.__i18n;
        if (i && i.strings && i.strings[i.lang] && i.strings[i.lang][key] !== undefined) return i.strings[i.lang][key];
        return fallback;
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nameVal = form.querySelector('[name="name"]').value.trim();
            var emailVal = form.querySelector('[name="email"]').value.trim();
            var msgVal = form.querySelector('[name="message"]').value.trim();

            if (!nameVal || !emailVal || !msgVal) return;

            formBtn.disabled = true;
            formBtn.classList.add('form__button--sending');
            if (btnText) btnText.textContent = i18n('form_sending', 'Sending…');
            status.textContent = '';
            status.className = 'contact__status';

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: 'Neue Kontaktanfrage — Resonance Studio Berlin',
                    from_name: nameVal,
                    email: emailVal,
                    message: msgVal,
                    botcheck: ''
                })
            })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success) {
                    status.textContent = i18n('form_success', 'Thank you! Your message has been sent.');
                    status.classList.add('contact__status--success');
                    form.reset();
                } else {
                    status.textContent = i18n('form_error', 'Oops — something went wrong. Please try again or email us directly.');
                    status.classList.add('contact__status--error');
                }
            })
            .catch(function () {
                status.textContent = i18n('form_error', 'Oops — something went wrong. Please try again or email us directly.');
                status.classList.add('contact__status--error');
            })
            .finally(function () {
                formBtn.disabled = false;
                formBtn.classList.remove('form__button--sending');
                if (btnText) btnText.textContent = i18n('form_send', 'Send Message');
            });
        });
    }
    /* ---------- Ticker (rAF-based, iOS-safe) ---------- */
    var ticker = document.getElementById('ticker');
    var tTrack = document.getElementById('ticker-track');

    if (ticker && tTrack) {
        var tBaseSpeed = 57.6;  // pixels per second (≈0.96px @ 60fps)
        var tVelocity  = -tBaseSpeed;
        var tIsMobile  = 'ontouchstart' in window;
        var tFriction  = tIsMobile ? 0.985 : 0.99;
        var tOffset    = 0;
        var tSetW      = 0;
        var tOrigHTML  = tTrack.innerHTML;
        var tReady     = false;
        var tDrag      = false;
        var tStartX    = 0;
        var tBaseOff   = 0;
        var tLastX     = 0;
        var tLastTime  = 0;
        var tPrevTime  = 0;

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
                var html = tTrack.innerHTML;
                for (var c = 0; c < copies; c++) html += tOrigHTML;
                tTrack.innerHTML = html;

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

        // Recovery: reach -tBaseSpeed in ~2s
        var tAccelRate = tBaseSpeed / 2; // px/s per second

        function tLoop(now) {
            if (!tPrevTime) tPrevTime = now;
            var dt = Math.min((now - tPrevTime) / 1000, 0.05); // seconds, capped at 50ms
            tPrevTime = now;

            if (tReady) {
                if (!tDrag) {
                    tOffset += tVelocity * dt;

                    var target = -tBaseSpeed;
                    var diff = target - tVelocity;

                    if (Math.abs(diff) < 0.5) {
                        tVelocity = target;
                    } else if (Math.abs(tVelocity) > tBaseSpeed * 1.2) {
                        // Phase 1: fast momentum — apply friction (tFriction^60 per second)
                        tVelocity *= Math.pow(tFriction, 60 * dt);
                    } else {
                        // Phase 2: linear accel toward target
                        if (diff < 0) {
                            tVelocity -= tAccelRate * dt;
                            if (tVelocity < target) tVelocity = target;
                        } else {
                            tVelocity += tAccelRate * dt;
                            if (tVelocity > target) tVelocity = target;
                        }
                    }
                }
                tWrap();
                tTrack.style.transform = 'translate3d(' + tOffset + 'px,0,0)';
            }
            if (tVisible) requestAnimationFrame(tLoop);
        }

        // Pause ticker when off-screen (battery saving)
        var tVisible = true;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                tVisible = entries[0].isIntersecting;
                if (tVisible && tReady) requestAnimationFrame(tLoop);
            }).observe(ticker);
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
                tVelocity = (pt.clientX - tLastX) / dt * 1000; // px/second
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

        var tResizeTimer;
        tBuild();
        requestAnimationFrame(tLoop);
        window.addEventListener('resize', function () {
            clearTimeout(tResizeTimer);
            tResizeTimer = setTimeout(function () { tReady = false; tBuild(); }, 250);
        });
    }

    /* ---------- Content protection ---------- */
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('copy', function (e) { e.preventDefault(); });
})();
