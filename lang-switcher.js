/* =============================================
   Resonance Studio Berlin — Language Switcher
   Client-side i18n (no PHP required)
   ============================================= */

(function () {
    'use strict';

    var LANGS = [
        { code: 'en', country: 'gb', name: 'English' },
        { code: 'de', country: 'de', name: 'Deutsch' },
        { code: 'zh', country: 'cn', name: '中文' },
        { code: 'es', country: 'es', name: 'Español' },
        { code: 'fr', country: 'fr', name: 'Français' },
        { code: 'ar', country: 'sa', name: 'العربية' },
        { code: 'pt', country: 'br', name: 'Português' },
        { code: 'hi', country: 'in', name: 'हिन्दी' },
        { code: 'ru', country: 'ru', name: 'Русский' },
        { code: 'ja', country: 'jp', name: '日本語' },
        { code: 'ko', country: 'kr', name: '한국어' },
        { code: 'it', country: 'it', name: 'Italiano' },
        { code: 'tr', country: 'tr', name: 'Türkçe' },
        { code: 'nl', country: 'nl', name: 'Nederlands' },
        { code: 'pl', country: 'pl', name: 'Polski' },
        { code: 'uk', country: 'ua', name: 'Українська' },
        { code: 'th', country: 'th', name: 'ไทย' },
        { code: 'vi', country: 'vn', name: 'Tiếng Việt' },
        { code: 'id', country: 'id', name: 'Bahasa' },
        { code: 'sv', country: 'se', name: 'Svenska' },
        { code: 'da', country: 'dk', name: 'Dansk' },
        { code: 'ro', country: 'ro', name: 'Română' },
        { code: 'cs', country: 'cz', name: 'Čeština' },
        { code: 'el', country: 'gr', name: 'Ελληνικά' },
        { code: 'hu', country: 'hu', name: 'Magyar' },
        { code: 'fa', country: 'ir', name: 'فارسی' }
    ];

    var FLAG_CDN = 'https://flagcdn.com/48x36/';
    var allStrings = null;
    var currentLang = 'en';

    var btn      = document.getElementById('lang-btn');
    var dropdown = document.getElementById('lang-dropdown');
    var flagImg  = document.getElementById('lang-flag');
    var nameSpan = document.getElementById('lang-name');

    /* ---------- Helpers ---------- */
    function isSupported(code) {
        for (var i = 0; i < LANGS.length; i++) {
            if (LANGS[i].code === code) return true;
        }
        return false;
    }

    function getLangData(code) {
        for (var i = 0; i < LANGS.length; i++) {
            if (LANGS[i].code === code) return LANGS[i];
        }
        return LANGS[0];
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setCookie(name, value) {
        document.cookie = name + '=' + value + ';path=/;max-age=' + (365 * 86400) + ';SameSite=Lax';
    }

    function getPreferredLang() {
        var params = new URLSearchParams(window.location.search);
        var p = params.get('lang');
        if (p && isSupported(p)) return p;

        var cookie = getCookie('lang');
        if (cookie && isSupported(cookie)) return cookie;

        var stored = localStorage.getItem('lang');
        if (stored && isSupported(stored)) return stored;

        var browser = (navigator.language || '').slice(0, 2).toLowerCase();
        if (isSupported(browser)) return browser;

        return 'en';
    }

    /* ---------- Apply translations ---------- */
    function applyTranslations(lang) {
        if (!allStrings) return;
        var t = allStrings[lang] || allStrings['en'];
        if (!t) return;

        // data-i18n → textContent
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.textContent = t[key];
        });

        // data-i18n-html → innerHTML (for <br> etc.)
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        document.documentElement.lang = lang;
        if (t.meta_title) document.title = t.meta_title;
        var desc = document.querySelector('meta[name="description"]');
        if (desc && t.meta_description) desc.content = t.meta_description;
    }

    /* ---------- Update button display ---------- */
    function updateButton() {
        if (!btn) return;
        var data = getLangData(currentLang);
        flagImg.src = FLAG_CDN + data.country + '.webp';
        flagImg.alt = data.code;
        nameSpan.textContent = data.name;

        // Update active state in dropdown
        var options = dropdown.querySelectorAll('.lang-option');
        options.forEach(function (opt) {
            opt.classList.toggle('active', opt.dataset.lang === currentLang);
        });
    }

    /* ---------- Switch language ---------- */
    function switchLang(lang) {
        if (lang === currentLang) return;
        currentLang = lang;
        setCookie('lang', lang);
        localStorage.setItem('lang', lang);
        applyTranslations(lang);
        updateButton();
        dropdown.classList.remove('show');
    }

    /* ---------- Build dropdown (once) ---------- */
    function init() {
        if (!btn || !dropdown) return;

        // Build dropdown options
        var html = '';
        for (var i = 0; i < LANGS.length; i++) {
            var l = LANGS[i];
            var active = l.code === currentLang ? ' active' : '';
            html += '<button class="lang-option' + active + '" data-lang="' + l.code + '">' +
                '<img src="' + FLAG_CDN + l.country + '.webp" alt="' + l.code + '" class="lang-flag">' +
                '<span>' + l.name + '</span></button>';
        }
        dropdown.innerHTML = html;

        // Toggle dropdown — one listener, never duplicated
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Close on outside click
        document.addEventListener('click', function () {
            dropdown.classList.remove('show');
        });

        // Language selection via event delegation
        dropdown.addEventListener('click', function (e) {
            var option = e.target.closest('.lang-option');
            if (!option) return;
            switchLang(option.dataset.lang);
        });

        updateButton();
    }

    /* ---------- Start ---------- */
    currentLang = getPreferredLang();
    setCookie('lang', currentLang);
    localStorage.setItem('lang', currentLang);

    fetch('lang/strings.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            allStrings = data;
            applyTranslations(currentLang);
            init();
        })
        .catch(function () {
            init();
        });
})();
